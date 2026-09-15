import axios from "axios";
import apiClient from "./apiClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "tcp_auth_token";
const USER_KEY = "tcp_auth_user";

// Kept identical (by hand) to SECURITY_QUESTIONS in the API's services/security.js — see that
// file's comment for why duplicating this tiny static list is fine.
export const SECURITY_QUESTIONS = [
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What was the make of your first car?",
  "What is your favorite book?",
  "What was your childhood nickname?",
];

function storeSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function login(username, password) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
    storeSession(data);
    return data.user;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to sign in");
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return getToken() !== null && getCurrentUser() !== null;
}

export function isAdmin() {
  return getCurrentUser()?.role === "admin";
}

// True once the account still needs the forced first-login flow (OnboardingPage.jsx) — either
// step, so App.jsx's route guard can redirect there before the rest of the app is reachable.
export function needsOnboarding() {
  const user = getCurrentUser();
  return Boolean(user) && (user.mustChangePassword || !user.securityQuestionsSet);
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const { data } = await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    storeSession(data);
    return data.user;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to change password");
  }
}

export async function setupSecurityQuestions(question1, answer1, question2, answer2) {
  try {
    const { data } = await apiClient.post("/auth/security-questions", {
      question1,
      answer1,
      question2,
      answer2,
    });
    storeSession(data);
    return data.user;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to save security questions");
  }
}

export async function getSecurityQuestions(username) {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/auth/security-questions/${encodeURIComponent(username)}`,
    );
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to look up security questions");
  }
}

export async function verifySecurityAnswers(username, answer1, answer2) {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/verify-security-answers`, {
      username,
      answer1,
      answer2,
    });
    return data.resetToken;
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to verify answers");
  }
}

export async function resetPasswordWithToken(resetToken, newPassword) {
  try {
    await axios.post(`${API_BASE_URL}/auth/reset-password`, { resetToken, newPassword });
  } catch (err) {
    throw new Error(err.response?.data?.error ?? "Failed to reset password");
  }
}
