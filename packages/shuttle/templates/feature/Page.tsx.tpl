import { use{{Feature}}Page } from "./use{{Feature}}Page";
import "./{{featureKebab}}.css";

export function {{Feature}}Page() {
  const { data, error, loading } = use{{Feature}}Page();
  return (
    <div className="page {{featureKebab}}-page">
      <h1>{{Feature}}</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
