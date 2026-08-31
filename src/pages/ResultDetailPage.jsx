import { Link, useParams } from "react-router-dom";
import { MOCK_RESULTS } from "../services/resultsService";

function ResultDetailPage() {
  const { id } = useParams();
  const result = MOCK_RESULTS.find((item) => String(item.id) === id);

  if (!result) {
    return <p className="text-sm text-gray-500">Result not found.</p>;
  }

  return (
    <div>
      <Link to="/results" className="mb-4 inline-block text-sm text-gray-500">
        &larr; Back to Results
      </Link>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">{result.name}</h1>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-gray-500">Email</dt>
          <dd className="text-gray-900">{result.email}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd
            className={
              result.status === "PASS" ? "font-medium text-green-600" : "font-medium text-red-600"
            }
          >
            {result.status}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Submitted Date</dt>
          <dd className="text-gray-900">{result.submittedDate}</dd>
        </div>
      </dl>
    </div>
  );
}

export default ResultDetailPage;
