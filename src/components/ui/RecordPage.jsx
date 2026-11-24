import { useState } from "react";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import Button from "./Button.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import DataTable from "./DataTable.jsx";
import EmptyState from "./EmptyState.jsx";
import Modal from "./Modal.jsx";

export default function RecordPage({ title, description, service, useData, fields, columns, filters = [], onExport }) {
  const { records, loading, error, refresh } = useData();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [actionError, setActionError] = useState("");
  const visible = records.filter((row) => {
    const matchesText = !query || Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(query.toLowerCase()));
    return matchesText && (filter === "All" || row.status === filter || row.priority === filter || row.severity === filter);
  });

  async function save(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      setActionError("");
      if (editing?.id) await service.update(editing.id, values);
      else await service.create(values);
      setEditing(null);
      await refresh();
    } catch (err) { setActionError(err.message || "Could not save this item."); }
  }

  async function remove() {
    try { setActionError(""); await service.remove(deleting.id); setDeleting(null); await refresh(); }
    catch (err) { setActionError(err.message || "Could not delete this item."); setDeleting(null); }
  }

  return <section>
    <div className="page-heading"><div><div className="eyebrow">QUALITY MANAGEMENT</div><h1>{title}</h1><p>{description}</p></div><div className="heading-actions">{onExport && <Button variant="secondary" onClick={() => onExport(records)}><Download size={15} /> Export CSV</Button>}<Button onClick={() => { setActionError(""); setEditing({}); }}><Plus size={17} /> New {title.replace(/s$/, "")}</Button></div></div>
    {actionError && <div className="alert error-alert" role="alert">{actionError}</div>}
    {error && <div className="alert error-alert" role="alert">{error}</div>}
    <div className="panel">
      <div className="table-toolbar"><div><strong>{records.length} items</strong><span> in your workspace</span></div><div className="table-tools"><input className="control search-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items…" />{filters.length > 0 && <select className="control" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{filters.map((item) => <option key={item}>{item}</option>)}</select>}</div></div>
      {loading ? <div className="loading-inline">Loading…</div> : visible.length === 0 ? <EmptyState title={records.length ? "No matching items" : `No ${title.toLowerCase()} yet`} description={records.length ? "Try changing the search or filter." : "Use the button above to create your first item."} /> : <DataTable columns={columns} rows={visible} renderActions={(row) => <><button className="row-icon" title="Edit" onClick={() => { setActionError(""); setEditing(row); }}><Pencil size={15} /></button><button className="row-icon delete-icon" title="Delete" onClick={() => setDeleting(row)}><Trash2 size={15} /></button></>} />}
    </div>
    {editing && <Modal title={editing.id ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`} onClose={() => setEditing(null)}><form className="record-form" onSubmit={save}>{fields.map((field) => <label key={field.name}>{field.label}{field.type === "textarea" ? <textarea name={field.name} required={field.required !== false} defaultValue={editing[field.name] || ""} rows="3" /> : field.options ? <select name={field.name} defaultValue={editing[field.name] || field.options[0]}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input name={field.name} required={field.required !== false} type={field.type || "text"} defaultValue={editing[field.name] || ""} />}</label>)}{actionError && <div className="alert error-alert">{actionError}</div>}<div className="form-actions"><Button variant="secondary" type="button" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit">Save item</Button></div></form></Modal>}
    {deleting && <ConfirmDialog onCancel={() => setDeleting(null)} onConfirm={remove} />}
  </section>;
}
