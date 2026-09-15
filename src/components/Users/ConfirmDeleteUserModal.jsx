import { useState } from "react";
import Modal from "../Modal";
import { deleteUser } from "../../services/usersService";

function ConfirmDeleteUserModal({ user, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return null;

  const handleDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteUser(user.id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Delete User" onClose={onClose}>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Delete user <strong>{user.username}</strong>? This action cannot be undone.
      </p>

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
          className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteUserModal;
