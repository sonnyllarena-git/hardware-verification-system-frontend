import { useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_RESULTS } from "../services/resultsService";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "submittedDate", label: "Submitted Date" },
];

function ResultsListPage() {
  const [sortKey, setSortKey] = useState("submittedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredResults = MOCK_RESULTS.filter((result) => {
    const matchesStatus = statusFilter === "ALL" || result.status === statusFilter;
    const query = searchText.toLowerCase();
    const matchesSearch =
      result.name.toLowerCase().includes(query) || result.email.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    if (a[sortKey] > b[sortKey]) return direction;
    if (a[sortKey] < b[sortKey]) return -direction;
    return 0;
  });

  const escapeCsvField = (value) => `"${String(value).replace(/"/g, '""')}"`;

  const handleExport = () => {
    const header = COLUMNS.map((column) => escapeCsvField(column.label)).join(",");
    const rows = sortedResults.map((result) =>
      COLUMNS.map((column) => escapeCsvField(result[column.key])).join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hardware_results.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">Results</h1>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by name or email"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="ALL">All statuses</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
        >
          Export CSV
        </button>
      </div>

      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="cursor-pointer select-none px-4 py-2 font-medium"
              >
                {column.label}
                {sortKey === column.key && (sortDirection === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
            <th className="px-4 py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((result) => (
            <tr key={result.id} className="border-b border-gray-100">
              <td className="px-4 py-2 text-gray-900">{result.name}</td>
              <td className="px-4 py-2 text-gray-600">{result.email}</td>
              <td
                className={
                  result.status === "PASS"
                    ? "px-4 py-2 font-medium text-green-600"
                    : "px-4 py-2 font-medium text-red-600"
                }
              >
                {result.status}
              </td>
              <td className="px-4 py-2 text-gray-600">{result.submittedDate}</td>
              <td className="px-4 py-2">
                <Link to={`/results/${result.id}`} className="text-sm font-medium text-blue-600">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsListPage;
