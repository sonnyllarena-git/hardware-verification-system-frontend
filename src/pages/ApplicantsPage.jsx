import { useState, useEffect, useCallback } from "react";
import {
  fetchApplicants as fetchApplicantsApi,
  addApplicant,
  exportApplicantsCsv,
} from "../services/applicantsService";
import ApplicantsTable from "../components/Applicants/ApplicantsTable";
import BulkUploadModal from "../components/Applicants/BulkUploadModal";
import EmailModal from "../components/Applicants/EmailModal";
import ConfirmDeleteModal from "../components/Applicants/ConfirmDeleteModal";
import TestResultModal from "../components/Applicants/TestResultModal";
import Toast from "../components/Toast";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "pending_email", label: "pending (email)" },
  { value: "pending", label: "pending" },
  { value: "pass", label: "pass" },
  { value: "fail", label: "fail" },
];

const getDisplayStatus = (applicant) =>
  applicant.result ? applicant.result.passFail?.toLowerCase() : applicant.status;

const matchesFilters = (applicant, searchTerm, statusFilter) => {
  const query = searchTerm.toLowerCase();
  const matchesSearch =
    applicant.name.toLowerCase().includes(query) || applicant.email.toLowerCase().includes(query);
  const matchesStatus = statusFilter === "ALL" || getDisplayStatus(applicant) === statusFilter;
  return matchesSearch && matchesStatus;
};

function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [emailModalApplicant, setEmailModalApplicant] = useState(null);
  const [deleteModalApplicant, setDeleteModalApplicant] = useState(null);
  const [resultModalApplicant, setResultModalApplicant] = useState(null);
  const [toast, setToast] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Reusable — passed down as onRefresh and called again after add/bulk/email/delete actions.
  const fetchApplicants = useCallback(async () => {
    try {
      const data = await fetchApplicantsApi();
      setApplicants(data);
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  // Deliberately NOT `fetchApplicants()` here. react-hooks/set-state-in-effect flags any bare call
  // from an effect body to a same-component function whose body calls setState anywhere (it doesn't
  // matter that every setter above only runs after an await) — but a promise chain passed straight
  // to .then/.catch/.finally is the rule's own sanctioned pattern ("calling setState in a callback
  // function when external state changes"). So the one-time mount fetch is inlined that way,
  // mirroring the existing ResultsListPage.jsx/ResultDetailPage.jsx effects; fetchApplicants stays
  // available for reuse from event handlers, which this rule doesn't touch.
  useEffect(() => {
    fetchApplicantsApi()
      .then(setApplicants)
      .catch((err) => setToast({ message: err.message, type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const handleAddApplicant = async (event) => {
    event.preventDefault();
    setAdding(true);
    try {
      await addApplicant({ name: newName, email: newEmail });
      setNewName("");
      setNewEmail("");
      showToast(`Added ${newName}.`, "success");
      fetchApplicants();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const filteredApplicants = applicants.filter((applicant) =>
    matchesFilters(applicant, searchTerm, statusFilter),
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Applicants</h1>
        <button
          type="button"
          onClick={() => setBulkModalOpen(true)}
          className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Bulk Upload
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => exportApplicantsCsv(filteredApplicants)}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>

        <form onSubmit={handleAddApplicant} className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Applicant Name"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="Email"
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={adding}
            className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading applicants…</p>
      ) : (
        <ApplicantsTable
          applicants={filteredApplicants}
          onRefresh={fetchApplicants}
          onToast={showToast}
          onOpenEmailModal={(applicant) => setEmailModalApplicant(applicant)}
          onOpenDeleteModal={(applicant) => setDeleteModalApplicant(applicant)}
          onOpenResultModal={(applicant) => setResultModalApplicant(applicant)}
        />
      )}

      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onUploaded={() => {
          fetchApplicants();
          showToast("Bulk upload complete.", "success");
        }}
      />

      <EmailModal
        applicant={emailModalApplicant}
        onClose={() => setEmailModalApplicant(null)}
        onSent={() => {
          fetchApplicants();
          setEmailModalApplicant(null);
          showToast("Email sent.", "success");
        }}
      />

      <ConfirmDeleteModal
        applicant={deleteModalApplicant}
        onClose={() => setDeleteModalApplicant(null)}
        onDeleted={() => {
          fetchApplicants();
          setDeleteModalApplicant(null);
          showToast("Applicant deleted.", "success");
        }}
      />

      <TestResultModal
        applicant={resultModalApplicant}
        onClose={() => setResultModalApplicant(null)}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}

export default ApplicantsPage;
