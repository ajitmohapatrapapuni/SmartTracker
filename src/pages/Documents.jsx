import { useState } from "react";
import { FileText, Sparkles, Trash2 } from "lucide-react";
import Button from "../components/ui/Button.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { useDocuments } from "../hooks/useDocuments.js";
import { documentService } from "../services/documentService.js";
import { aiService } from "../services/aiService.js";

export default function Documents() {
  const { records, loading, error, refresh } = useDocuments();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [document, setDocument] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function generate(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true); setMessage("");
    try {
      const result = await aiService.generateDocument({ type: form.type.value, requirement: form.requirement.value });
      setDocument(result);
      await documentService.create({ title: result.title, type: form.type.value, content: result.content });
      await refresh();
      setMessage("Document generated and saved.");
    } catch (err) { setMessage(err.message || "Could not generate document."); }
    finally { setBusy(false); }
  }

  async function remove() {
    try { await documentService.remove(deleting.id); setDeleting(null); await refresh(); }
    catch (err) { setMessage(`Could not delete document: ${err.message}`); setDeleting(null); }
  }

  return <section><div className="page-heading"><div><div className="eyebrow">PROJECT KNOWLEDGE</div><h1>Documents</h1><p>Generate and keep product requirement documents in one place.</p></div></div>
    <div className="panel doc-generator"><div><span className="quick-icon blue"><Sparkles size={19} /></span><h2>Draft a BRD or SRS</h2><p>Describe the product or feature and let AI create a structured first draft.</p></div><form onSubmit={generate}><label>Document type<select name="type"><option value="SRS">Software Requirements Specification (SRS)</option><option value="BRD">Business Requirements Document (BRD)</option></select></label><label>Product or feature description<textarea name="requirement" rows="4" required placeholder="What are you building, who is it for, and what should it do?" /></label><Button disabled={busy}><Sparkles size={16} />{busy ? "Generating…" : "Generate document"}</Button></form></div>
    {message && <div className={`alert ${message.startsWith("Could not") ? "error-alert" : "success-alert"}`}>{message}</div>}{error && <div className="alert error-alert">{error}</div>}
    {document && <article className="panel generated-document"><div className="panel-heading"><div><div className="eyebrow">LATEST DRAFT</div><h2>{document.title}</h2></div><Button variant="secondary" onClick={() => window.print()}>Print / Save PDF</Button></div><pre>{document.content}</pre></article>}
    <div className="document-list-heading"><h2>Saved documents</h2><span>{records.length} documents</span></div>
    {loading ? <div className="panel loading-inline">Loading documents…</div> : records.length === 0 ? <div className="panel"><EmptyState title="No documents yet" description="Generate a BRD or SRS above to add your first document." /></div> : <div className="document-grid">{records.map((item) => <article className="panel document-card" key={item.id}><div className="document-icon"><FileText size={20} /></div><div className="document-meta"><span>{item.type}</span><small>{new Date(item.created_at).toLocaleDateString()}</small></div><h3>{item.title}</h3><div className="document-card-actions"><Button variant="secondary" onClick={() => setDocument(item)}>Open document</Button><button className="row-icon delete-icon" onClick={() => setDeleting(item)} title="Delete document"><Trash2 size={16} /></button></div></article>)}</div>}
    {deleting && <ConfirmDialog onCancel={() => setDeleting(null)} onConfirm={remove} />}
  </section>;
}
