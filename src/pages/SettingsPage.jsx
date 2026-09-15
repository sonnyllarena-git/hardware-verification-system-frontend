import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { changePassword } from "../services/authService";
import { getStoredTheme, applyTheme } from "../utils/theme";

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Current password
          </span>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            New password
          </span>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            Confirm new password
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </label>

        <p className="text-xs text-gray-500 dark:text-gray-400">Must be at least 8 characters.</p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Password changed.</p>}

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          {saving ? "Saving…" : "Change Password"}
        </button>
      </form>
    </section>
  );
}

function DarkModeSection() {
  const [theme, setTheme] = useState(getStoredTheme());

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          Dark Mode
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={theme === "dark"}
          onClick={toggle}
          className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
            theme === "dark" ? "bg-gray-900 dark:bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
              theme === "dark" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">About</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        TCP Hardware Verification System — checks that applicant computers meet TheCreditPros&apos;
        hardware requirements before onboarding, via a Chrome extension that self-reports specs for
        compliance review here.
      </p>
    </section>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
      <ChangePasswordSection />
      <DarkModeSection />
      <AboutSection />
    </div>
  );
}

export default SettingsPage;
