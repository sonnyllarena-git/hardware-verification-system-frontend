import { useState } from "react";
import Modal from "./Modal";

const TYPE_OPTIONS = ["os", "cpu", "ram", "storage", "internet", "screen", "hardware"];

// direct-submit-rpc.sql casts min_value to ::INT for these two types when scoring a
// submission — a decimal here (e.g. "6.88") passes this form fine but throws Postgres
// error 22P02 at submit time, failing every applicant's hardware check until fixed.
const INTEGER_TYPES = new Set(["ram", "storage"]);

const APPLIES_TO_OPTIONS = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "Macbook" },
];

const emptyRequirement = {
  name: "",
  type: TYPE_OPTIONS[0],
  appliesTo: "windows",
  minValue: "",
  maxValue: "",
  required: true,
  description: "",
};

function RequirementModal({ requirement, onSave, onClose }) {
  const isEdit = requirement != null;
  const [form, setForm] = useState(isEdit ? { ...requirement } : { ...emptyRequirement });
  const [minValueError, setMinValueError] = useState(null);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();

    if (INTEGER_TYPES.has(form.type) && !/^\d+$/.test(form.minValue.trim())) {
      setMinValueError(`Min Value must be a whole number for "${form.type}" requirements.`);
      return;
    }
    setMinValueError(null);

    onSave(form);
  };

  return (
    <Modal title={isEdit ? "Edit Requirement" : "Add Requirement"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Requirement Name
          </span>
          <input
            type="text"
            value={form.name}
            readOnly={isEdit}
            onChange={(event) => updateField("name", event.target.value)}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${isEdit ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" : ""}`}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Type</span>
          <select
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Applies To
          </span>
          <select
            value={form.appliesTo}
            onChange={(event) => updateField("appliesTo", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            {APPLIES_TO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">Min Value</span>
          <input
            type="text"
            value={form.minValue}
            onChange={(event) => {
              updateField("minValue", event.target.value);
              if (minValueError) setMinValueError(null);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
          {minValueError && (
            <span className="mt-1 block text-xs text-red-600 dark:text-red-400">
              {minValueError}
            </span>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Max Value (optional)
          </span>
          <input
            type="text"
            value={form.maxValue}
            onChange={(event) => updateField("maxValue", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Required</span>
          <button
            type="button"
            onClick={() => updateField("required", !form.required)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              form.required
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {form.required ? "Yes" : "No"}
          </button>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Description
          </span>
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

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
            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {isEdit ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default RequirementModal;
