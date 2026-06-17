import { useEffect, useState } from "react";
import { api } from "@web/api/client";
import { useFetch } from "@web/lib/useFetch";
import type { AgentSettings } from "@web/types";
import "./settings.css";

export function SettingsPage() {
  const { data: config, loading, error, reload } = useFetch(() => api.config());
  const [options, setOptions] = useState<Awaited<ReturnType<typeof api.agentOptions>> | null>(null);
  const [agent, setAgent] = useState<AgentSettings>({ runnerId: "manual", modelId: "auto" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    api.agentOptions().then(setOptions).catch(() => {});
  }, []);

  useEffect(() => {
    if (config?.agent) setAgent(config.agent);
  }, [config]);

  async function save() {
    setSaving(true);
    setSaveMsg(null);
    try {
      await api.updateConfigSettings(agent);
      setSaveMsg("Saved");
      reload();
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page settings-page">
      <h1>Settings</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {options && (
        <section className="card">
          <h2>Agent runner</h2>
          <label>
            Runner
            <select
              value={agent.runnerId}
              onChange={(e) => setAgent((a) => ({ ...a, runnerId: e.target.value }))}
            >
              {options.runners.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {options.modelCatalogs.cursor && (
            <label>
              Model
              <select
                value={agent.modelId}
                onChange={(e) => setAgent((a) => ({ ...a, modelId: e.target.value }))}
              >
                {options.modelCatalogs.cursor.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="button" className="btn" disabled={saving} onClick={save}>
            Save
          </button>
          {saveMsg && <p className="muted">{saveMsg}</p>}
        </section>
      )}
    </div>
  );
}
