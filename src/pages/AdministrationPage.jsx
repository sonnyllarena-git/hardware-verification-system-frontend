import { useState } from "react";
import UserManagementPanel from "../components/Users/UserManagementPanel";
import ComplianceRequirementsPanel from "../components/ComplianceRequirementsPanel";

const TABS = [
  { value: "users", label: "User Management" },
  { value: "requirements", label: "Hardware Compliance Requirements" },
];

function AdministrationPage() {
  const [tab, setTab] = useState("users");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Administration
      </h1>

      <div className="mb-4 flex gap-2">
        {TABS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTab(option.value)}
            className={
              tab === option.value
                ? "cursor-pointer rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                : "cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === "users" ? <UserManagementPanel /> : <ComplianceRequirementsPanel />}
    </div>
  );
}

export default AdministrationPage;
