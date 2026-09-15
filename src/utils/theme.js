const THEME_KEY = "tcp_dark_mode";

export function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
}

// Called once before the app renders (main.jsx) so the page never flashes the wrong theme.
export function initTheme() {
  applyTheme(getStoredTheme());
}
