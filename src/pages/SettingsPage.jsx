import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  fetchRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
} from "../services/requirementsService";
import RequirementTable from "../components/RequirementTable";
import RequirementModal from "../components/RequirementModal";
import Toast from "../components/Toast";

const OS_TABS = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "Macbook" },
];

function SettingsPage() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [osFilter, setOsFilter] = useState("windows");
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    fetchRequirements()
      .then(setRequirements)
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveEdit = (updated) => {
    updateRequirement(updated.id, updated)
      .then((saved) => {
        setRequirements((current) => current.map((r) => (r.id === saved.id ? saved : r)));
        setEditingRequirement(null);
        showToast("Requirement updated.");
      })
      .catch((err) => showToast(err.message, "error"));
  };

  const handleCreate = (created) => {
    createRequirement(created)
      .then((saved) => {
        setRequirements((current) => [...current, saved]);
        setIsAdding(false);
        showToast("Requirement created.");
      })
      .catch((err) => showToast(err.message, "error"));
  };

  const handleDelete = (id) => {
    deleteRequirement(id)
      .then(() => {
        setRequirements((current) => current.filter((requirement) => requirement.id !== id));
        showToast("Requirement deleted.");
      })
      .catch((err) => showToast(err.message, "error"));
  };

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">
        Hardware Compliance Requirements
      </h1>

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

      {loading ? (
        <p className="text-sm text-gray-500">Loading requirements…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <RequirementTable
            requirements={requirements}
            osFilter={osFilter}
            onEdit={setEditingRequirement}
            onDelete={handleDelete}
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Add New Requirement
        </button>
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

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </div>
  );
}

export default SettingsPage;
