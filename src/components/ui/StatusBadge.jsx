export default function StatusBadge({ children }) {
  const value = String(children || "Open").toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge status-${value}`}>{children || "Open"}</span>;
}
