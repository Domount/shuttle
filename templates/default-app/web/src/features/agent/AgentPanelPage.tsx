import { useState } from "react";
import { api } from "@web/api/client";
import { useFetch } from "@web/lib/useFetch";
import type { AgentStreamEvent } from "@web/types";
import "./agent.css";

export function AgentPanelPage() {
  const { data: requests, loading, error, reload } = useFetch(api.requests);
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  async function queue(type: string) {
    await api.queueRequest(type, {});
    reload();
  }

  async function runStream(id: string) {
    setRunning(true);
    setLogs([]);
    const res = await fetch(`/api/requests/${id}/execute/stream`, { method: "POST" });
    const reader = res.body?.getReader();
    if (!reader) return;
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        const lines = part.split("\n");
        const eventLine = lines.find((l) => l.startsWith("event:"));
        const dataLine = lines.find((l) => l.startsWith("data:"));
        if (!eventLine || !dataLine) continue;
        const event = eventLine.slice(6).trim() as AgentStreamEvent["type"];
        const data = JSON.parse(dataLine.slice(5));
        if (event === "log" && data.line) setLogs((prev) => [...prev, data.line]);
      }
    }
    setRunning(false);
    reload();
  }

  return (
    <div className="page agent-page">
      <header className="page-header">
        <h1>Agent</h1>
        <p className="lead">Queue jobs for the smart backend. One pending research-task at a time.</p>
      </header>

      <div className="agent-actions">
        <button type="button" className="btn" onClick={() => queue("research-task")}>
          Queue research-task
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => queue("message")}>
          Queue message
        </button>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {requests && (
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="muted">
                  No requests yet
                </td>
              </tr>
            )}
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.type}</td>
                <td>
                  <span className={`status${r.status === "pending" ? " status-pending" : ""}`}>{r.status}</span>
                </td>
                <td className="muted">{r.createdAt}</td>
                <td>
                  {r.status === "pending" && (
                    <button type="button" className="btn" disabled={running} onClick={() => runStream(r.id)}>
                      Run
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {logs.length > 0 && (
        <section className="card">
          <h2>Stream log</h2>
          <div className="log-panel">{logs.join("\n")}</div>
        </section>
      )}
    </div>
  );
}
