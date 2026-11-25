export default function GeneratorForm({ onGenerate, busy }) {
  return <form className="generator-form" onSubmit={async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const files = Array.from(event.currentTarget.elements.documents.files);
    const requirement = String(data.get("requirement") || "").trim();
    if (!requirement && !files.length) {
      alert("Enter a requirement or upload at least one BRD/SRS PDF.");
      return;
    }
    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      alert("Each PDF must be 5 MB or smaller.");
      return;
    }
    const documents = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        name: file.name,
        mime_type: "application/pdf",
        data: String(reader.result).split(",")[1],
      });
      reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
      reader.readAsDataURL(file);
    })));
    onGenerate({ requirement: data.get("requirement"), count: Number(data.get("count")), documents });
  }}>
    <label>Requirement or feature<textarea name="requirement" rows="6" placeholder="Example: Users can reset their password using a time-limited email link." /></label>
    <label>BRD or SRS PDF documents (optional)<input name="documents" type="file" accept="application/pdf" multiple /></label>
    <label>Number of test cases<select name="count" defaultValue="5"><option value="3">3 cases</option><option value="5">5 cases</option><option value="10">10 cases</option></select></label>
    <button className="button button-primary" disabled={busy}>{busy && <span className="loading-spinner" aria-hidden="true" />}{busy ? "Generating…" : "Generate test cases"}</button>
  </form>;
}
