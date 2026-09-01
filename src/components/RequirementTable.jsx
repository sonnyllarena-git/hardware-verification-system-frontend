import { Pencil, Trash2 } from "lucide-react";

function RequirementTable({ requirements, osFilter, onEdit, onDelete }) {
  const visibleRequirements = requirements.filter(
    (requirement) =>
      osFilter === "both" ||
      requirement.appliesToOS === "both" ||
      requirement.appliesToOS === osFilter,
  );

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500">
          <th className="px-4 py-2 font-medium">Requirement Name</th>
          {osFilter === "both" ? (
            <>
              <th className="px-4 py-2 font-medium">Windows Min</th>
              <th className="px-4 py-2 font-medium">Macbook Min</th>
            </>
          ) : (
            <th className="px-4 py-2 font-medium">Min Value</th>
          )}
          <th className="px-4 py-2 font-medium">Type</th>
          <th className="px-4 py-2 font-medium">Required</th>
          <th className="px-4 py-2 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {visibleRequirements.map((requirement) => (
          <tr key={requirement.id} className="border-b border-gray-100">
            <td className="px-4 py-2 text-gray-900">{requirement.name}</td>
            {osFilter === "both" ? (
              <>
                <td className="px-4 py-2 text-gray-600">{requirement.windowsMin}</td>
                <td className="px-4 py-2 text-gray-600">{requirement.macosMin}</td>
              </>
            ) : (
              <td className="px-4 py-2 text-gray-600">
                {osFilter === "macos" ? requirement.macosMin : requirement.windowsMin}
              </td>
            )}
            <td className="px-4 py-2 text-gray-600">{requirement.type}</td>
            <td className="px-4 py-2 text-gray-600">{requirement.required ? "Yes" : "No"}</td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(requirement)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(requirement.id)}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-800"
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

export default RequirementTable;
