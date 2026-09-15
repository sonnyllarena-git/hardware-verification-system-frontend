import { Pencil, KeyRound, Trash2 } from "lucide-react";

function RoleBadge({ role }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        isAdmin
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {isAdmin ? "Admin" : "User"}
    </span>
  );
}

function StatusBadges({ user }) {
  if (user.mustChangePassword) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
        Must change password
      </span>
    );
  }
  if (!user.securityQuestionsSet) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
        Security questions not set
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
      Active
    </span>
  );
}

function UsersTable({ users, onEdit, onResetPassword, onDelete }) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <th className="px-4 py-2 font-medium">Username</th>
          <th className="px-4 py-2 font-medium">Role</th>
          <th className="px-4 py-2 font-medium">Status</th>
          <th className="px-4 py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800">
            <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{user.username}</td>
            <td className="px-4 py-2">
              <RoleBadge role={user.role} />
            </td>
            <td className="px-4 py-2">
              <StatusBadges user={user} />
            </td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(user)}
                  className="flex cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onResetPassword(user)}
                  className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(user)}
                  className="flex cursor-pointer items-center gap-1 text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
