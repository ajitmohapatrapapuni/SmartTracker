import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function GeneratedPreview({ cases, onSave, generating = false }) {
  const [selected, setSelected] = useState(() => cases.map((_, index) => index));
  useEffect(() => setSelected(cases.map((_, index) => index)), [cases.length]);
  if (!cases.length) return null;
  return <div className="generated-list"><div className="generated-heading"><div><div className="eyebrow">AI DRAFT</div><h2>{generating ? "Test cases as they’re ready" : "Review generated test cases"}</h2></div><Button onClick={() => onSave(cases.filter((_, index) => selected.includes(index)))} disabled={generating || !selected.length}><Save size={16} /> Save selected ({selected.length})</Button></div>
    {cases.map((item, index) => <label className={`generated-case${selected.includes(index) ? " selected" : ""}`} key={`${item.title}-${index}`}><input type="checkbox" checked={selected.includes(index)} disabled={generating} onChange={() => setSelected((current) => current.includes(index) ? current.filter((entry) => entry !== index) : [...current, index])} /><span className="checkmark"><Check size={14} /></span><span className="generated-body"><strong>{item.title}</strong><span>{item.description || item.steps || "Generated test scenario"}</span><small>Expected: {item.expected_result || item.expectedResult || "Verify expected behavior"}</small></span><span className="priority-text">{item.priority || "Medium"}</span></label>)}
  </div>;
}
