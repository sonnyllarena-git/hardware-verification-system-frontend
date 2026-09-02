import { useState } from "react";
import ActionButtons from "./ActionButtons";
import ApplicantHistory from "./ApplicantHistory";

const STATUS_LABELS = {
  pending_email: { text: "pending (email)", className: "bg-amber-100 text-amber-700" },
  pending: { text: "pending", className: "bg-blue-100 text-blue-700" },
  pass: { text: "PASS ✓", className: "bg-green-100 text-green-700" },
  fail: { text: "FAIL ✗", className: "bg-red-100 text-red-700" },
};

// Deterministic given a fixed input date — not the impure Date.now()/Math.random()
// pattern this repo's eslint-plugin-react-hooks purity rule flags, so no hoisting concern.
function formatExpiry(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const formatted = date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `(link expires on ${formatted})`;
}

function StatusCell({ applicant }) {
  const config = STATUS_LABELS[applicant.status] ?? {
    text: applicant.status,
    className: "bg-gray-100 text-gray-600",
  };
  const expiryText =
    applicant.status === "pending" ? formatExpiry(applicant.apiKeyExpiresAt) : null;
  return (
    <span>
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
      >
        {config.text}
      </span>
      {expiryText && <span className="ml-1.5 text-xs text-gray-500">{expiryText}</span>}
    </span>
  );
}

function ApplicantRow({
  applicant,
  onRefresh,
  onToast,
  onOpenEmailModal,
  onOpenDeleteModal,
  onOpenResultModal,
}) {
  const [expanded, setExpanded] = useState(false);
  const [hasExpandedOnce, setHasExpandedOnce] = useState(false);

  const toggleExpanded = () => {
    setExpanded((current) => !current);
    setHasExpandedOnce(true);
  };

  return (
    <>
      <tr className="border-b border-gray-100">
        <td className="px-4 py-2 text-gray-900">{applicant.name}</td>
        <td className="px-4 py-2 text-gray-600">{applicant.email}</td>
        <td className="px-4 py-2">
          <StatusCell applicant={applicant} />
        </td>
        <td className="px-4 py-2">
          <ActionButtons
            applicant={applicant}
            onRefresh={onRefresh}
            onToast={onToast}
            onOpenEmailModal={onOpenEmailModal}
            onOpenDeleteModal={onOpenDeleteModal}
            onOpenResultModal={onOpenResultModal}
          />
        </td>
        <td className="px-2 py-2 text-center">
          <button
            type="button"
            onClick={toggleExpanded}
            aria-label={expanded ? "Collapse history" : "Expand history"}
            className="cursor-pointer text-gray-500 transition-colors hover:text-gray-800"
          >
            {expanded ? "▼" : "▶"}
          </button>
        </td>
      </tr>
      {hasExpandedOnce && (
        <tr hidden={!expanded} className="border-b border-gray-100">
          <td colSpan={5} className="p-0">
            <ApplicantHistory applicant={applicant} expanded={expanded} />
          </td>
        </tr>
      )}
    </>
  );
}

export default ApplicantRow;
