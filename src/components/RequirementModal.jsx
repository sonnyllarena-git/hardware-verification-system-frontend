import { useState } from "react";
import Modal from "./Modal";

const TYPE_OPTIONS = ["os", "cpu", "ram", "storage", "internet", "screen", "hardware"];

const APPLIES_TO_OPTIONS = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "Macbook" },
];

const generateRequirementId = () => Date.now();

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

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(isEdit ? form : { ...form, id: generateRequirementId() });
  };

  return (
    <Modal title={isEdit ? "Edit Requirement" : "Add Requirement"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Requirement Name</span>
          <input
            type="text"
            value={form.name}
            readOnly={isEdit}
            onChange={(event) => updateField("name", event.target.value)}
            className={`w-full rounded-md border border-gray-300 px-3 py-2 ${isEdit ? "bg-gray-100 text-gray-500" : ""}`}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Type</span>
          <select
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Applies To</span>
          <select
            value={form.appliesTo}
            onChange={(event) => updateField("appliesTo", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {APPLIES_TO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Min Value</span>
          <input
            type="text"
            value={form.minValue}
            onChange={(event) => updateField("minValue", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Max Value (optional)</span>
          <input
            type="text"
            value={form.maxValue}
            onChange={(event) => updateField("maxValue", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Required</span>
          <button
            type="button"
            onClick={() => updateField("required", !form.required)}
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              form.required
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {form.required ? "Yes" : "No"}
          </button>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
