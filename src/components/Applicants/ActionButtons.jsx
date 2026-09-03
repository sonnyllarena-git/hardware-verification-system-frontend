import { useState } from "react";
import Modal from "../Modal";
import { generateLink, revokeLink } from "../../services/applicantsService";
import { parseDbTimestamp } from "../../utils/dateTime";

const BUTTON_CLASS =
  "cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

// Hoisted to module level (not defined inside the component) per this repo's
// eslint-plugin-react-hooks purity rule — see LESSONS.md 2026-09-01 "Build & Tooling" entry.
// `new Date()` (current time) is only safe to call outside the component body.
function isLinkExpired(apiKeyExpiresAt) {
  const expiresAt = parseDbTimestamp(apiKeyExpiresAt);
  if (!expiresAt) return false;
  return expiresAt < new Date();
}

function GenerateLinkButton({ applicant, busy, onGenerate }) {
  const enabled =
    applicant.status === "pending_email" ||
    applicant.status === "fail" ||
    isLinkExpired(applicant.apiKeyExpiresAt);
  return (
    <button
      type="button"
      className={BUTTON_CLASS}
      disabled={!enabled || busy}
      onClick={onGenerate}
      title={
        enabled ? undefined : "Link already generated. Email it first, or wait for expiration."
      }
    >
      {busy ? "Generating…" : "Generate link"}
    </button>
  );
}

function EmailLinkButton({ applicant, onOpenEmailModal }) {
  const enabled = applicant.status === "pending";
  const label = applicant.emailSentAt ? "Resend Email" : "Email link";
  return (
    <button
      type="button"
      className={BUTTON_CLASS}
      disabled={!enabled}
      onClick={() => onOpenEmailModal(applicant)}
      title={enabled ? undefined : "Generate a link first."}
    >
      {label}
    </button>
  );
}

function ExpiresLinkButton({ applicant, busy, onOpenConfirm }) {
  const enabled = applicant.status === "pending";
  return (
    <button
      type="button"
      className={BUTTON_CLASS}
      disabled={!enabled || busy}
      onClick={onOpenConfirm}
    >
      {busy ? "Revoking…" : "Expires link"}
    </button>
  );
}

function DeleteButton({ applicant, onOpenDeleteModal }) {
  return (
    <button type="button" className={BUTTON_CLASS} onClick={() => onOpenDeleteModal(applicant)}>
      Delete
    </button>
  );
}

function TestResultButton({ applicant, onOpenResultModal }) {
  const enabled = applicant.status === "pass" || applicant.status === "fail";
  return (
    <button
      type="button"
      className={BUTTON_CLASS}
      disabled={!enabled}
      onClick={() => onOpenResultModal(applicant)}
      title={enabled ? undefined : "No result yet."}
    >
      Test Result
    </button>
  );
}

function RevokeConfirmModal({ busy, onCancel, onConfirm }) {
  return (
    <Modal title="Revoke Link" onClose={onCancel}>
      <p className="mb-4 text-sm text-gray-600">
        Revoke this link? The applicant will not be able to use it. Generate a new one if needed.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="cursor-pointer rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Revoking…" : "Revoke"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

function ActionButtons({
  applicant,
  onRefresh,
  onToast,
  onOpenEmailModal,
  onOpenDeleteModal,
  onOpenResultModal,
}) {
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateLink(applicant.id);
      onRefresh();
      onToast("Link generated", "success");
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async () => {
    setRevoking(true);
    try {
      await revokeLink(applicant.id);
      onRefresh();
      onToast("Link revoked", "success");
      setConfirmRevoke(false);
    } catch (err) {
      onToast(err.message, "error");
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <GenerateLinkButton applicant={applicant} busy={generating} onGenerate={handleGenerate} />
      <EmailLinkButton applicant={applicant} onOpenEmailModal={onOpenEmailModal} />
      <ExpiresLinkButton
        applicant={applicant}
        busy={revoking}
        onOpenConfirm={() => setConfirmRevoke(true)}
      />
      <DeleteButton applicant={applicant} onOpenDeleteModal={onOpenDeleteModal} />
      <TestResultButton applicant={applicant} onOpenResultModal={onOpenResultModal} />

      {confirmRevoke && (
        <RevokeConfirmModal
          busy={revoking}
          onCancel={() => setConfirmRevoke(false)}
          onConfirm={handleRevoke}
        />
      )}
    </div>
  );
}

export default ActionButtons;
