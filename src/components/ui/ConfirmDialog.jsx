import Button from "./Button.jsx";
import Modal from "./Modal.jsx";

export default function ConfirmDialog({ onConfirm, onCancel, title = "Delete this item?" }) {
  return <Modal title={title} onClose={onCancel}><p className="muted">This action cannot be undone.</p><div className="form-actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button className="danger-button" onClick={onConfirm}>Delete</Button></div></Modal>;
}
