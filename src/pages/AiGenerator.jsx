import { useState } from "react";
import { Sparkles } from "lucide-react";
import GeneratedPreview from "../components/ai/GeneratedPreview.jsx";
import GeneratorForm from "../components/ai/GeneratorForm.jsx";
import { testCaseService } from "../services/testCaseService.js";
import { aiService } from "../services/aiService.js";
import { useTestCases } from "../hooks/useTestCases.js";

export default function AiGenerator() {
  const [cases, setCases] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const { refresh } = useTestCases();

  async function generate(input) {
    setBusy(true); setMessage(""); setCases([]);
    try {
      const result = await aiService.generateTestCases(input, (event, payload) => {
        if (event === "case") setCases((current) => [...current, payload.testCase]);
      });
      if (!Array.isArray(result.testCases)) throw new Error("The AI response did not contain a valid test case list.");
      setCases(result.testCases);
    } catch (error) { setCases([]); setMessage(`Could not generate test cases: ${error.message || "Please try again."}`); }
    finally { setBusy(false); }
  }

  async function saveSelected(selected) {
    try {
      const result = await testCaseService.createMany(selected.map((item) => ({
        title: item.title,
        description: item.steps || item.description || "",
        expected_result: item.expected_result || item.expectedResult || "",
        priority: item.priority || "Medium",
        status: "Open",
      })));
      await refresh();
      setCases([]);
      setMessage(`${result.length} test case${result.length === 1 ? "" : "s"} saved.`);
    } catch (error) { setMessage(`Could not save all selected cases: ${error.message}`); }
  }

  return <section><div className="page-heading"><div><div className="eyebrow">AI-ASSISTED QUALITY</div><h1>AI test case generator</h1><p>Turn product requirements into reviewable test scenarios in seconds.</p></div><div className="ai-orb"><Sparkles size={25} /></div></div>
    <div className="generator-layout"><section className="panel generator-panel"><div className="panel-heading"><div><h2>Describe your feature</h2><p>Be clear about user roles, rules and edge cases.</p></div></div><GeneratorForm onGenerate={generate} busy={busy} /><div className="privacy-note">Generated drafts are saved only after you select and save them.</div></section><aside className="panel tips-panel"><div className="tips-spark"><Sparkles size={18} /></div><h2>Better input, better coverage</h2><p>Include the user’s goal, important constraints and unusual conditions.</p><div className="example-prompt">“A user can sign in with email and password. Lock the account for 15 minutes after 5 failed attempts.”</div><div className="tip-line">AI results are drafts. Review them before adding them to your suite.</div></aside></div>
    {busy && <div className="generation-status" role="status"><span className="loading-spinner" />{cases.length ? `Drafting test cases… ${cases.length} ready.` : "Gemini Flash-Lite is drafting your test cases…"}</div>}
    {message && <div className={`alert ${message.startsWith("Could not") ? "error-alert" : "success-alert"}`} role="status">{message}</div>}
    <GeneratedPreview cases={cases} onSave={saveSelected} generating={busy} />
  </section>;
}
