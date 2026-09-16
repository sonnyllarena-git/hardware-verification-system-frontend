import { useState, useEffect } from "react";
import Modal from "../Modal";
import Badge from "../Badge";
import { buildComplianceBreakdown } from "../../services/resultsService";
import { fetchRequirements } from "../../services/requirementsService";
import { parseDbTimestamp } from "../../utils/dateTime";

// Format in Eastern explicitly (rather than the viewer's own browser/OS timezone via a bare
// toLocaleString()) so it reads the same wall-clock time for every HR/IT reviewer regardless
// of where they open the dashboard from.
// Intl.DateTimeFormat throws if dateStyle/timeStyle are mixed with individual field options
// like timeZoneName, so this spells out the fields instead of using the style shorthand.
function formatResultTime(value) {
  const date = parseDbTimestamp(value);
  if (!date) return "—";
  return date.toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function SpecRow({ label, value }) {
  return (
    <div>
      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );
}

function TestResultModal({ applicant, onClose }) {
  const [requirements, setRequirements] = useState([]);

  // Fetched once (not per-applicant) since requirements rarely change and this modal stays
  // mounted across the page's lifetime — see ApplicantsPage, which always renders it.
  useEffect(() => {
    fetchRequirements()
      .then(setRequirements)
      .catch(() => setRequirements([]));
  }, []);

  if (!applicant) return null;

  const { result } = applicant;
  const breakdown = result ? buildComplianceBreakdown(requirements, result.specs) : [];

  return (
    <Modal title="Hardware Check Result" onClose={onClose} maxWidth="max-w-2xl">
      {!result ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No result yet.</p>
      ) : (
        <div className="max-h-[65vh] space-y-4 overflow-auto pr-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {applicant.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatResultTime(result.submittedAt)}
              </p>
            </div>
            <Badge status={result.passFail} />
          </div>

          <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Specs</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <SpecRow label="OS" value={result.specs.osVersion} />
              <SpecRow label="CPU" value={result.specs.cpuModel || "Unknown"} />
              <SpecRow label="CPU Cores" value={result.specs.cpuCores} />
              <SpecRow label="RAM (GB)" value={result.specs.ram} />
              <SpecRow label="Total Storage (GB)" value={`${result.specs.storageGb} GB`} />
              {result.specs.storageDrives?.length > 1 && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Storage Drives</dt>
                  <dd className="text-gray-900 dark:text-gray-100">
                    {result.specs.storageDrives.map((gb, index) => (
                      <div key={index}>{`Drive ${index + 1}: ${gb} GB`}</div>
                    ))}
                  </dd>
                </div>
              )}
              <SpecRow label="Screen" value={result.specs.screenResolution} />
              <SpecRow label="Internet Down (Mbps)" value={result.specs.internetDown} />
              <SpecRow label="Internet Up (Mbps)" value={result.specs.internetUp} />
              <SpecRow label="Webcam" value={result.specs.webcam ? "Yes" : "No"} />
              <SpecRow label="Headset" value={result.specs.headset ? "Yes" : "No"} />
            </dl>
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-800">
            <h3 className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-300">
              Compliance Breakdown
            </h3>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {breakdown.map((requirement) => (
                <li
                  key={requirement.key}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">{requirement.label}</span>
                  <span className={requirement.passed ? "text-green-600" : "text-red-600"}>
                    {requirement.passed ? "PASS" : "FAIL"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default TestResultModal;
