import { api } from "@web/api/client";
import { useFetch } from "@web/lib/useFetch";
import "./dashboard.css";

export function DashboardPage() {
  const { data: config, loading, error } = useFetch(api.config);
  const { data: memory } = useFetch(api.memory);

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="lead">
          Shuttle — a local agentic app framework with a normal Node backend, smart agent layer, and React client.
        </p>
        <div className="pill-row">
          <span className="pill">Express API</span>
          <span className="pill">JSON store</span>
          <span className="pill">Agent skills</span>
          <span className="pill">React</span>
        </div>
      </header>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}

      {config && (
        <section className="card">
          <h2>Config</h2>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </section>
      )}

      {memory?.active && (
        <section className="card">
          <h2>Memory</h2>
          <p className="muted">{Object.keys(memory.active).length} active files in memory</p>
        </section>
      )}
    </div>
  );
}
