import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Charts({ testCases, bugs }) {
  const data = [
    { name: "Open", cases: testCases.filter((item) => item.status === "Open").length, bugs: bugs.filter((item) => item.status === "Open").length },
    { name: "In progress", cases: testCases.filter((item) => item.status === "In Progress").length, bugs: bugs.filter((item) => item.status === "In Progress").length },
    { name: "Passed / Closed", cases: testCases.filter((item) => item.status === "Passed").length, bugs: bugs.filter((item) => item.status === "Closed").length },
    { name: "Failed", cases: testCases.filter((item) => item.status === "Failed").length, bugs: bugs.filter((item) => item.status === "Failed").length },
  ];
  return <div className="chart-area"><ResponsiveContainer width="100%" height={250}><BarChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}><CartesianGrid stroke="#eef0f5" vertical={false} /><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#4b4b4b", fontSize: 11 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#4b4b4b", fontSize: 11 }} /><Tooltip /><Bar dataKey="cases" name="Test cases" fill="var(--purple)" radius={[5, 5, 0, 0]} /><Bar dataKey="bugs" name="Bugs" fill="#ff8573" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>;
}
