import RecordPage from "../components/ui/RecordPage.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useBugs } from "../hooks/useBugs.js";
import { bugService } from "../services/bugService.js";

export default function Bugs() {
  return <RecordPage title="Bugs" description="Log defects, prioritize impact and follow fixes through to closure." service={bugService} useData={useBugs} fields={[{ name: "title", label: "Bug title" }, { name: "description", label: "Steps to reproduce / details", type: "textarea" }, { name: "severity", label: "Severity", options: ["Low", "Medium", "High", "Critical"] }, { name: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] }, { name: "status", label: "Status", options: ["Open", "In Progress", "Resolved", "Closed"] }]} columns={[{ key: "title", label: "Bug" }, { key: "description", label: "Details" }, { key: "severity", label: "Severity" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status", render: (value) => <StatusBadge>{value}</StatusBadge> }]} filters={["Open", "In Progress", "Resolved", "Closed", "Low", "Medium", "High", "Critical"]} />;
}
