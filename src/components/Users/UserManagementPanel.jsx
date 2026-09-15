import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { listUsers, createUser, updateUser } from "../../services/usersService";
import UsersTable from "./UsersTable";
import UserModal from "./UserModal";
import ResetPasswordModal from "./ResetPasswordModal";
import ConfirmDeleteUserModal from "./ConfirmDeleteUserModal";
import Toast from "../Toast";

function UserManagementPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [resettingUser, setResettingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (payload) => {
    const created = await createUser(payload);
    setUsers((current) => [...current, created]);
    setIsAdding(false);
    showToast("User created.");
  };

  const handleSaveEdit = async (payload) => {
    const updated = await updateUser(editingUser.id, payload);
    setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
    showToast("User updated.");
  };

  return (
    <div>
      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading users…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <UsersTable
            users={users}
            onEdit={setEditingUser}
            onResetPassword={setResettingUser}
            onDelete={setDeletingUser}
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {isAdding && (
        <UserModal user={null} onSave={handleCreate} onClose={() => setIsAdding(false)} />
      )}

      {editingUser && (
        <UserModal
          user={editingUser}
          onSave={handleSaveEdit}
          onClose={() => setEditingUser(null)}
        />
      )}

      <ResetPasswordModal
        user={resettingUser}
        onClose={() => setResettingUser(null)}
        onReset={(updated) => {
          setUsers((current) => current.map((u) => (u.id === updated.id ? updated : u)));
          showToast("Password reset.");
        }}
      />

      <ConfirmDeleteUserModal
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onDeleted={() => {
          setUsers((current) => current.filter((u) => u.id !== deletingUser.id));
          showToast("User deleted.");
        }}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}

export default UserManagementPanel;
