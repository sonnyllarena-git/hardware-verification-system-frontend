const AUTH_STORAGE_KEY = "tcp_auth_user";

const VALID_CREDENTIALS = { username: "admin", password: "password", displayName: "Sonny" };

export function login(username, password) {
  if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
    localStorage.setItem(AUTH_STORAGE_KEY, VALID_CREDENTIALS.displayName);
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getCurrentUser() {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
