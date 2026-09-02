import { useState } from "react";
import Modal from "../Modal";
import { deleteApplicant } from "../../services/applicantsService";

function ConfirmDeleteModal({ applicant, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!applicant) return null;

  const handleDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteApplicant(applicant.id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete Applicant" onClose={onClose}>
      <p className="mb-3 text-sm text-gray-600">
        Delete applicant: <strong>{applicant.name}</strong> ({applicant.email})?
      </p>
      <p className="mb-1 text-sm text-gray-600">This will remove:</p>
      <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
        <li>The applicant record</li>
        <li>All generated links</li>
        <li>Event history</li>
        <li>Any submitted hardware results</li>
      </ul>
      <p className="mb-4 text-sm font-medium text-gray-900">This action cannot be undone.</p>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Deleting…" : "Delete"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
