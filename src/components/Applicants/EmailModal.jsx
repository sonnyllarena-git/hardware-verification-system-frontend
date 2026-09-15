import { useState } from "react";
import Modal from "../Modal";
import { sendEmail, buildShareableLink } from "../../services/applicantsService";
import { getCurrentUser } from "../../services/authService";

const DEFAULT_SUBJECT = "Hardware Verification Check";

// applicant.apiKey may be absent from the /applicants list payload (the contract's GET response
// doesn't guarantee the raw key) — buildShareableLink is expected to tolerate an empty apiKey.
function buildDefaultBody(applicant) {
  const link = buildShareableLink({
    apiKey: applicant.apiKey,
    name: applicant.name,
    email: applicant.email,
  });
  const hrName = getCurrentUser()?.username ?? "";

  return `Hi ${applicant.name},

We need to verify that your computer meets our technical requirements.

Please click the link below to install our Chrome extension and run the verification:

${link}

API Key: ${applicant.apiKey ?? ""}

The link will expire in 7 days.

If you have any issues, contact your IT department.

Best regards,
${hrName}
The Credit Pros`;
}

function EmailModal({ applicant, onClose, onSent }) {
  const [initializedFor, setInitializedFor] = useState(null);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // "Adjusting state when a prop changes" during render (React-documented pattern), not a
  // useEffect — the parent may keep this component mounted persistently and just swap the
  // applicant prop, so this re-derives the template only when the applicant actually changes,
  // without the extra render/commit cycle (and set-state-in-effect lint error) a useEffect
  // would add.
  if (applicant && applicant.id !== initializedFor) {
    setInitializedFor(applicant.id);
    setSubject(DEFAULT_SUBJECT);
    setBody(buildDefaultBody(applicant));
    setError(null);
    setCopied(false);
  }

  if (!applicant) return null;

  const handleSend = async () => {
    setBusy(true);
    setError(null);
    try {
      await sendEmail(applicant.id, { subject, body });
      onSent();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Real sending isn't wired up for staff use yet — this is the primary path today: staff
  // copies the body here and pastes it into Outlook themselves. Send Email (Resend) stays
  // available alongside it for whenever that's turned on.
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy to clipboard — please select and copy the text manually.");
    }
  };

  return (
    <Modal title="Send Verification Link" onClose={onClose}>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">To: {applicant.email}</p>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>

      <label className="mb-3 block text-sm">
        <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Body</span>
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={10}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </label>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={busy}
          className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send Email"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default EmailModal;
