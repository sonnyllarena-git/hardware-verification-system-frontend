import { useState } from "react";
import { Plus } from "lucide-react";
import { REQUIREMENTS_CONFIG } from "../services/requirementsService";
import RequirementTable from "../components/RequirementTable";
import RequirementModal from "../components/RequirementModal";

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

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">
        Hardware Compliance Requirements
      </h1>
      <p className="mb-4 inline-block rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Phase 1: Changes not saved to database.
      </p>

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
    </div>
  );
}

export default SettingsPage;
