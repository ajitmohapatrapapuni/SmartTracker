import RecordPage from "../components/ui/RecordPage.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useRequirements } from "../hooks/useRequirements.js";
import { requirementService } from "../services/requirementService.js";

export default function Requirements() {
  return <RecordPage title="Requirements" description="Capture product behavior and turn it into testable acceptance criteria." service={requirementService} useData={useRequirements} fields={[{ name: "title", label: "Requirement title" }, { name: "description", label: "Description / acceptance criteria", type: "textarea" }, { name: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] }, { name: "status", label: "Status", options: ["Draft", "Approved", "In Progress", "Done"] }]} columns={[{ key: "title", label: "Requirement" }, { key: "description", label: "Description" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status", render: (value) => <StatusBadge>{value}</StatusBadge> }]} filters={["Draft", "Approved", "In Progress", "Done", "Low", "Medium", "High", "Critical"]} />;
}
