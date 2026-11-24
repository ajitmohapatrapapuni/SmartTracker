import RecordPage from "../components/ui/RecordPage.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { projectService } from "../services/projectService.js";
import { useProjects } from "../hooks/useProjects.js";

export default function Projects() {
  return <RecordPage title="Projects" description="Organize quality work across products and releases." service={projectService} useData={useProjects} fields={[{ name: "name", label: "Project name" }, { name: "description", label: "Description", type: "textarea", required: false }, { name: "status", label: "Status", options: ["Active", "On hold", "Completed"] }]} columns={[{ key: "name", label: "Project" }, { key: "description", label: "Description" }, { key: "status", label: "Status", render: (value) => <StatusBadge>{value}</StatusBadge> }]} filters={["Active", "On hold", "Completed"]} />;
}
