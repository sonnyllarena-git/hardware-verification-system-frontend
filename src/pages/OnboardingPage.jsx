import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  changePassword,
  setupSecurityQuestions,
  SECURITY_QUESTIONS,
} from "../services/authService";

// Forced first-login flow: a fresh account (or one an admin just reset) can't reach the rest of
// the app until it has a real password and 2 security questions set up (see App.jsx's
// RequireAuth). Only the steps actually still needed are shown — an admin password-reset later
// doesn't re-ask for security questions since those are already set.
function OnboardingPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [step, setStep] = useState(user?.mustChangePassword ? "password" : "questions");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const [question1, setQuestion1] = useState(SECURITY_QUESTIONS[0]);
  const [answer1, setAnswer1] = useState("");
  const [question2, setQuestion2] = useState(SECURITY_QUESTIONS[1]);
  const [answer2, setAnswer2] = useState("");
  const [questionsError, setQuestionsError] = useState(null);
  const [savingQuestions, setSavingQuestions] = useState(false);

  const finishIfDone = (updatedUser) => {
    if (updatedUser.mustChangePassword) {
      setStep("password");
    } else if (!updatedUser.securityQuestionsSet) {
      setStep("questions");
    } else {
      navigate("/dashboard");
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const updated = await changePassword(currentPassword, newPassword);
      finishIfDone(updated);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleQuestionsSubmit = async (event) => {
    event.preventDefault();
    setQuestionsError(null);
    if (question1 === question2) {
      setQuestionsError("Please choose two different questions.");
      return;
    }
    if (!answer1.trim() || !answer2.trim()) {
      setQuestionsError("Both answers are required.");
      return;
    }
    setSavingQuestions(true);
    try {
      const updated = await setupSecurityQuestions(question1, answer1, question2, answer2);
      finishIfDone(updated);
    } catch (err) {
      setQuestionsError(err.message);
    } finally {
      setSavingQuestions(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome, {user?.username}
        </h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Before you continue, please finish setting up your account.
        </p>

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Step 1: Change your password
            </h2>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                Current (temporary) password
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

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Must be at least 8 characters.
            </p>

            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full cursor-pointer rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
            >
              {savingPassword ? "Saving…" : "Continue"}
            </button>
          </form>
        )}

        {step === "questions" && (
          <form onSubmit={handleQuestionsSubmit} className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Step 2: Set up security questions
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              These let you reset your password later without an administrator.
            </p>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                Security question 1
              </span>
              <select
                value={question1}
                onChange={(event) => setQuestion1(event.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                {SECURITY_QUESTIONS.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                value={answer1}
                onChange={(event) => setAnswer1(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
                Security question 2
              </span>
              <select
                value={question2}
                onChange={(event) => setQuestion2(event.target.value)}
                className="mb-2 w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                {SECURITY_QUESTIONS.map((question) => (
                  <option key={question} value={question}>
                    {question}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Your answer"
                value={answer2}
                onChange={(event) => setAnswer2(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>

            {questionsError && <p className="text-sm text-red-600">{questionsError}</p>}

            <button
              type="submit"
              disabled={savingQuestions}
              className="w-full cursor-pointer rounded-md bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
            >
              {savingQuestions ? "Saving…" : "Finish"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;
