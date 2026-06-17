import { api } from "@web/api/client";
import { useFetch } from "@web/lib/useFetch";
import "./dashboard.css";

export function DashboardPage() {
  const { data: config, loading, error } = useFetch(api.config);
  const { data: memory } = useFetch(api.memory);

  return (
    <div className="page dashboard-page">
      <h1>Dashboard</h1>
      <p className="muted">Welcome to {{projectName}} — your Shuttle app shell.</p>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}

      {config && (
        <section className="card">
          <h2>Config</h2>
          <pre>{JSON.stringify(config, null, 2)}</pre>
        </section>
      )}

      {memory && (
        <section className="card">
          <h2>Active memory</h2>
          <p className="muted">{Object.keys(memory.active).length} files loaded</p>
        </section>
      )}
    </div>
  );
}
