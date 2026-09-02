import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { REQUIREMENTS_CONFIG } from "../services/requirementsService";
import { generateApiKey } from "../services/applicantsService";
import RequirementTable from "../components/RequirementTable";
import RequirementModal from "../components/RequirementModal";
import Modal from "../components/Modal";

const OS_TABS = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "Macbook" },
];

function SettingsPage() {
  const [requirements, setRequirements] = useState(REQUIREMENTS_CONFIG);
  const [osFilter, setOsFilter] = useState("windows");
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [issuedKey, setIssuedKey] = useState(null);
  const [issueError, setIssueError] = useState(null);
  const [issuing, setIssuing] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle");
  const [linkCopyStatus, setLinkCopyStatus] = useState("idle");

  const handleGenerateKey = async () => {
    setIssuing(true);
    setIssueError(null);
    try {
      const data = await generateApiKey({ name: applicantName, email: applicantEmail });
      setIssuedKey({ ...data, name: applicantName, email: applicantEmail });
      setCopyStatus("idle");
      setLinkCopyStatus("idle");
      setApplicantName("");
      setApplicantEmail("");
    } catch (err) {
      setIssueError(err.message);
    } finally {
      setIssuing(false);
    }
  };

  const copyToClipboard = async (text, setStatus) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleCopyKey = () => copyToClipboard(issuedKey.api_key, setCopyStatus);
  const handleCopyLink = () => copyToClipboard(checkPageLink, setLinkCopyStatus);

  const handleSaveEdit = (updated) => {
    setRequirements((current) =>
      current.map((requirement) => (requirement.id === updated.id ? updated : requirement)),
    );
    setEditingRequirement(null);
    setJustSaved(false);
  };

  const handleCreate = (created) => {
    setRequirements((current) => [...current, created]);
    setIsAdding(false);
    setJustSaved(false);
  };

  const handleDelete = (id) => {
    setRequirements((current) => current.filter((requirement) => requirement.id !== id));
    setJustSaved(false);
  };

  const checkPageLink = issuedKey
    ? `${window.location.origin}/check?${new URLSearchParams({
        apiKey: issuedKey.api_key,
        name: issuedKey.name,
        email: issuedKey.email,
      }).toString()}`
    : "";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">
        Hardware Compliance Requirements
      </h1>
      <p className="mb-4 inline-block rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Phase 1: Changes not saved to database.
      </p>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Issue Applicant API Key</h2>
        <div className="flex flex-wrap items-end gap-3">
          <input
            type="text"
            value={applicantName}
            onChange={(event) => setApplicantName(event.target.value)}
            placeholder="Applicant Name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={applicantEmail}
            onChange={(event) => setApplicantEmail(event.target.value)}
            placeholder="Email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleGenerateKey}
            disabled={issuing || !applicantName || !applicantEmail}
            className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {issuing ? "Generating…" : "Generate API Key"}
          </button>
        </div>
        {issueError && <p className="mt-2 text-sm text-red-600">{issueError}</p>}
      </div>

      <div className="mb-4 flex gap-2">
        {OS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setOsFilter(tab.value)}
            className={
              osFilter === tab.value
                ? "cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                : "cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <RequirementTable
          requirements={requirements}
          osFilter={osFilter}
          onEdit={setEditingRequirement}
          onDelete={handleDelete}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Add New Requirement
        </button>
        <button
          type="button"
          onClick={() => setJustSaved(true)}
          className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Save All Changes
        </button>
        {justSaved && (
          <span className="text-sm text-gray-500">Saved locally — Phase 1 mock only.</span>
        )}
      </div>

      {editingRequirement && (
        <RequirementModal
          requirement={editingRequirement}
          onSave={handleSaveEdit}
          onClose={() => setEditingRequirement(null)}
        />
      )}

      {isAdding && (
        <RequirementModal
          requirement={null}
          onSave={handleCreate}
          onClose={() => setIsAdding(false)}
        />
      )}

      {issuedKey && (
        <Modal title="API Key Generated" onClose={() => setIssuedKey(null)}>
          <p className="mb-2 break-all rounded-md bg-gray-100 px-3 py-2 font-mono text-sm text-gray-900">
            {issuedKey.api_key}
          </p>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Expires {new Date(issuedKey.expires_at).toDateString()}
            </p>
            {copyStatus === "copied" && (
              <span className="text-sm text-green-600">Copied to clipboard.</span>
            )}
            {copyStatus === "error" && <span className="text-sm text-red-600">Copy failed.</span>}
          </div>
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyKey}
              className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Copy to Clipboard
            </button>
            <Link to="/download" className="text-sm font-medium text-blue-600">
              Go to Download page →
            </Link>
          </div>

          <p className="mb-1 text-sm font-medium text-gray-700">Shareable applicant link</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={checkPageLink}
              readOnly
              className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-900"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="cursor-pointer whitespace-nowrap rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Copy Link
            </button>
          </div>
          {linkCopyStatus === "copied" && (
            <span className="text-sm text-green-600">Link copied to clipboard.</span>
          )}
          {linkCopyStatus === "error" && <span className="text-sm text-red-600">Copy failed.</span>}
        </Modal>
      )}
    </div>
  );
}

export default SettingsPage;
