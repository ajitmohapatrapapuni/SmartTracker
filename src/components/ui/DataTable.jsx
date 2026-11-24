export default function DataTable({ columns, rows, renderActions }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}{renderActions && <th className="actions-heading">Actions</th>}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : (row[column.key] || "—")}</td>)}{renderActions && <td className="row-actions">{renderActions(row)}</td>}</tr>)}</tbody></table></div>;
}
