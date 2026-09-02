import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, X, Monitor, Apple } from "lucide-react";
import { fetchResults, COMPLIANCE_REQUIREMENTS } from "../services/resultsService";
import Badge from "../components/Badge";

function ResultDetailPage() {
  const { id } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchResults().then(setResults);
  }, []);

  if (results === null) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

  const result = results.find((item) => String(item.id) === id);

  if (!result) {
    return <p className="text-sm text-gray-500">Result not found.</p>;
  }

  const OsIcon = result.osFamily === "macos" ? Apple : Monitor;
  const osBadgeStyle =
    result.osFamily === "macos" ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700";

  return (
    <div>
      <Link to="/applicants" className="mb-4 inline-block text-sm text-gray-500">
        &larr; Back to Applicants
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{result.name}</h1>
          <p className="text-sm text-gray-500">{result.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {result.osFamily && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${osBadgeStyle}`}
            >
              <OsIcon className="h-3.5 w-3.5" />
              {result.specs.osVersion}
            </span>
          )}
          <Badge status={result.status} />
        </div>
      </div>

      {result.specs === null ? (
        <p className="text-sm text-gray-500">
          This applicant hasn&apos;t submitted their hardware check yet.
        </p>
      ) : (
        <>
          <div className="mb-6 rounded-lg border border-gray-200 bg-white">
            <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-medium text-gray-700">
              Compliance Checklist
            </h2>
            <ul className="divide-y divide-gray-100">
              {COMPLIANCE_REQUIREMENTS.map((requirement) => {
                const passed = requirement.check(result.specs);
                return (
                  <li
                    key={requirement.key}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <span className="text-gray-700">{requirement.label}</span>
                    {passed ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-medium text-gray-700">Raw Specs</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(result.specs)
                .filter(([key]) => key !== "screenHeight")
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-gray-500">{key}</dt>
                    <dd className="text-gray-900">{String(value)}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultDetailPage;
