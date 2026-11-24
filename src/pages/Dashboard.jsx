import { Activity, Bug, CheckCircle2, ClipboardList, FolderKanban, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Charts from "../components/dashboard/Charts.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useBugs } from "../hooks/useBugs.js";
import { useProjects } from "../hooks/useProjects.js";
import { useTestCases } from "../hooks/useTestCases.js";

export default function Dashboard() {
  const projects = useProjects();
  const testCases = useTestCases();
  const bugs = useBugs();
  const loading = projects.loading || testCases.loading || bugs.loading;
  const error = projects.error || testCases.error || bugs.error;
  return <section>
    <div className="page-heading"><div><div className="eyebrow">YOUR QUALITY COMMAND CENTER</div><h1>Good work starts with clarity.</h1><p>Here’s what’s happening across your testing workspace.</p></div><Link to="/ai-generator" className="button button-primary"><Sparkles size={17} /> Generate test cases</Link></div>
    {error && <div className="alert error-alert">{error}</div>}
    <div className="stats-grid">
      <StatCard title="Active projects" value={loading ? "—" : projects.records.filter((row) => row.status !== "Completed").length} note={`${projects.records.length} total projects`} icon={FolderKanban} tone="violet" />
      <StatCard title="Test cases" value={loading ? "—" : testCases.records.length} note={`${testCases.records.filter((row) => row.status === "Passed").length} passed`} icon={ClipboardList} tone="blue" />
      <StatCard title="Open bugs" value={loading ? "—" : bugs.records.filter((row) => !["Closed", "Resolved"].includes(row.status)).length} note={`${bugs.records.filter((row) => row.severity === "Critical").length} critical severity`} icon={Bug} tone="coral" />
      <StatCard title="Pass rate" value={loading ? "—" : `${testCases.records.length ? Math.round(testCases.records.filter((row) => row.status === "Passed").length / testCases.records.length * 100) : 0}%`} note="of tracked test cases" icon={CheckCircle2} tone="green" />
    </div>
    <div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-heading"><div><h2>Quality snapshot</h2><p>Test cases and bug statuses</p></div><span className="live-label"><span /> LIVE</span></div>{loading ? <div className="loading-inline">Loading chart…</div> : <Charts testCases={testCases.records} bugs={bugs.records} />}<div className="chart-legend"><span><i className="legend-cases" /> Test cases</span><span><i className="legend-bugs" /> Bugs</span></div></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Jump into your next task</p></div></div><Link className="quick-action" to="/test-cases"><span className="quick-icon violet"><ClipboardList size={18} /></span><span><strong>Add a test case</strong><small>Document expected behavior</small></span><Plus size={17} /></Link><Link className="quick-action" to="/bugs"><span className="quick-icon coral"><Bug size={18} /></span><span><strong>Report a bug</strong><small>Track a defect to resolution</small></span><Plus size={17} /></Link><Link className="quick-action" to="/ai-generator"><span className="quick-icon blue"><Sparkles size={18} /></span><span><strong>Use AI generator</strong><small>Draft cases from a requirement</small></span><Plus size={17} /></Link></section></div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent test cases</h2><p>Your latest additions and updates</p></div><Link to="/test-cases" className="text-link">View all</Link></div>{!loading && testCases.records.length === 0 ? <EmptyState title="No test cases yet" description="Create a test case or use the AI generator to get started." /> : <div className="recent-list">{testCases.records.slice(0, 5).map((item) => <div className="recent-row" key={item.id}><span className="recent-mark"><Activity size={16} /></span><span className="recent-name">{item.title}</span><span className="priority-text">{item.priority}</span><StatusBadge>{item.status}</StatusBadge><small>{new Date(item.created_at).toLocaleDateString()}</small></div>)}</div>}</section>
  </section>;
}
