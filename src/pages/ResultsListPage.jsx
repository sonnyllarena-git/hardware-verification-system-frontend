import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { fetchResults } from "../services/resultsService";
import Badge from "../components/Badge";
import Modal from "../components/Modal";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "submittedDate", label: "Submitted Date" },
];

const generateApiKey = () =>
  Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 8))
    .join("-")
    .toUpperCase();

const generateApiKeyExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString();

function ResultsListPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("submittedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [apiKeyModal, setApiKeyModal] = useState(null);

  useEffect(() => {
    fetchResults()
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleGenerateApiKey = (result) => {
    setApiKeyModal({ name: result.name, key: generateApiKey(), expires: generateApiKeyExpiry() });
  };

  const filteredResults = results.filter((result) => {
    const matchesStatus = statusFilter === "ALL" || result.status === statusFilter;
    const query = searchText.toLowerCase();
    const matchesSearch =
      result.name.toLowerCase().includes(query) || result.email.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    const left = a[sortKey] ?? "";
    const right = b[sortKey] ?? "";
    if (left > right) return direction;
    if (left < right) return -direction;
    return 0;
  });

  const escapeCsvField = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

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
          <option value="PENDING">PENDING</option>
        </select>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading results…</p>
      ) : (
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
                <td className="px-4 py-2">
                  <Badge status={result.status} />
                </td>
                <td className="px-4 py-2 text-gray-600">{result.submittedDate ?? "—"}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    {result.status === "PENDING" ? (
                      <span className="text-sm text-gray-400">Awaiting submission</span>
                    ) : (
                      <Link
                        to={`/results/${result.id}`}
                        className="text-sm font-medium text-blue-600"
                      >
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleGenerateApiKey(result)}
                      className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                      title="Generate API Key"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {apiKeyModal && (
        <Modal title={`API Key — ${apiKeyModal.name}`} onClose={() => setApiKeyModal(null)}>
          <p className="mb-2 rounded-md bg-gray-100 px-3 py-2 font-mono text-sm text-gray-900">
            {apiKeyModal.key}
          </p>
          <p className="text-sm text-gray-500">Expires {apiKeyModal.expires}</p>
        </Modal>
      )}
    </div>
  );
}

export default ResultsListPage;
