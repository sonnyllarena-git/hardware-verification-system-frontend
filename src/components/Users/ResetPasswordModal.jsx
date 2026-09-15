import { useState } from "react";
import Modal from "../Modal";
import { resetUserPassword } from "../../services/usersService";

function ResetPasswordModal({ user, onClose, onReset }) {
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (temporaryPassword.length < 8) {
      setError("Temporary password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const updated = await resetUserPassword(user.id, temporaryPassword);
      onReset(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="Reset Password" onClose={onClose}>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Set a new temporary password for <strong>{user.username}</strong>. They&apos;ll be required
        to change it at their next login.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Temporary password
          </span>
          <input
            type="text"
            value={temporaryPassword}
            onChange={(event) => setTemporaryPassword(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Saving…" : "Reset Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ResetPasswordModal;
