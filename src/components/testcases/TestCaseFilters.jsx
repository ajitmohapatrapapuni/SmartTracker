export default function TestCaseFilters({ value, options, onChange }) {
  return <select className="control" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Filter test cases"><option>All</option>{options.map((option) => <option key={option}>{option}</option>)}</select>;
}
