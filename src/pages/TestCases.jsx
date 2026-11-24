import RecordPage from "../components/ui/RecordPage.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import { useTestCases } from "../hooks/useTestCases.js";
import { testCaseService } from "../services/testCaseService.js";
import { exportCsv } from "../utils/exportCsv.js";

export default function TestCases() {
  return <RecordPage title="Test cases" description="Write, organize and track manual test coverage." service={testCaseService} useData={useTestCases} onExport={(records) => exportCsv(records, "smarttracker-test-cases.csv")} fields={[{ name: "title", label: "Test case title" }, { name: "description", label: "Steps to reproduce", type: "textarea" }, { name: "expected_result", label: "Expected result", type: "textarea" }, { name: "priority", label: "Priority", options: ["Low", "Medium", "High", "Critical"] }, { name: "status", label: "Status", options: ["Open", "In Progress", "Passed", "Failed"] }]} columns={[{ key: "title", label: "Test case" }, { key: "description", label: "Steps" }, { key: "expected_result", label: "Expected result" }, { key: "priority", label: "Priority" }, { key: "status", label: "Status", render: (value) => <StatusBadge>{value}</StatusBadge> }]} filters={["Open", "In Progress", "Passed", "Failed", "Low", "Medium", "High", "Critical"]} />;
}
