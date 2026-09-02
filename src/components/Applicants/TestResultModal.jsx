import Modal from "../Modal";
import Badge from "../Badge";
import { COMPLIANCE_REQUIREMENTS } from "../../services/resultsService";

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
              <p className="text-xs text-gray-500">
                {new Date(result.submittedAt).toLocaleString()}
              </p>
            </div>
            <Badge status={result.passFail} />
          </div>

          <div className="rounded-md border border-gray-200 p-3">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Specs</h3>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <SpecRow label="OS" value={result.specs.osVersion} />
              <SpecRow label="CPU Cores" value={result.specs.cpuCores} />
              <SpecRow label="RAM (GB)" value={result.specs.ram} />
              <SpecRow label="Storage (GB)" value={result.specs.storageGb} />
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
