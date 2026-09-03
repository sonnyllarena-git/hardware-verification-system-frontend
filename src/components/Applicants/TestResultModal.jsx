import Modal from "../Modal";
import Badge from "../Badge";
import { COMPLIANCE_REQUIREMENTS } from "../../services/resultsService";

// submittedAt comes back as a UTC timestamptz; format it in Eastern explicitly (rather than
// the viewer's own browser/OS timezone via a bare toLocaleString()) so it reads the same
// wall-clock time for every HR/IT reviewer regardless of where they open the dashboard from.
// Intl.DateTimeFormat throws if dateStyle/timeStyle are mixed with individual field options
// like timeZoneName, so this spells out the fields instead of using the style shorthand.
function formatResultTime(value) {
  return new Date(value).toLocaleString("en-US", {
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
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

function TestResultModal({ applicant, onClose }) {
  if (!applicant) return null;

  const { result } = applicant;

  return (
    <Modal title="Hardware Check Result" onClose={onClose}>
      {!result ? (
        <p className="text-sm text-gray-500">No result yet.</p>
      ) : (
        <div className="max-h-[65vh] space-y-4 overflow-auto pr-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{applicant.name}</p>
              <p className="text-xs text-gray-500">{formatResultTime(result.submittedAt)}</p>
            </div>
            <Badge status={result.passFail} />
          </div>

          <div className="rounded-md border border-gray-200 p-3">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Specs</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <SpecRow label="OS" value={result.specs.osVersion} />
              <SpecRow label="CPU Cores" value={result.specs.cpuCores} />
              <SpecRow label="RAM (GB)" value={result.specs.ram} />
              <SpecRow label="Total Storage (GB)" value={`${result.specs.storageGb} GB`} />
              {result.specs.storageDrives?.length > 1 && (
                <div>
                  <dt className="text-gray-500">Storage Drives</dt>
                  <dd className="text-gray-900">
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

          <div className="rounded-md border border-gray-200">
            <h3 className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
              Compliance Breakdown
            </h3>
            <ul className="divide-y divide-gray-100">
              {COMPLIANCE_REQUIREMENTS.map((requirement) => {
                const passed = requirement.check(result.specs);
                return (
                  <li
                    key={requirement.key}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span className="text-gray-700">{requirement.label}</span>
                    <span className={passed ? "text-green-600" : "text-red-600"}>
                      {passed ? "PASS" : "FAIL"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default TestResultModal;
