export default function GeneratorForm({ onGenerate, busy }) {
  return <form className="generator-form" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); onGenerate({ requirement: data.get("requirement"), count: Number(data.get("count")) }); }}>
    <label>Requirement or feature<textarea name="requirement" rows="6" required placeholder="Example: Users can reset their password using a time-limited email link." /></label>
    <label>Number of test cases<select name="count" defaultValue="5"><option value="3">3 cases</option><option value="5">5 cases</option><option value="10">10 cases</option></select></label>
    <button className="button button-primary" disabled={busy}>{busy && <span className="loading-spinner" aria-hidden="true" />}{busy ? "Generating…" : "Generate test cases"}</button>
  </form>;
}
