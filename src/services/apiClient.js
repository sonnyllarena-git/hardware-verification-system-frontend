import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = "tcp_auth_token";

// Shared axios instance for every authenticated call in the app — attaches the staff session
// JWT (see authService.js/routes/auth.js) so individual services don't each need to know about
// tokens or headers. login() itself uses plain axios instead, since there's no token yet.
const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 here means the session is missing/expired/invalid — clear it and bounce to login. A
// hard redirect (not react-router) is used deliberately: this file has no router context, and an
// expired session should interrupt whatever page is open.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("tcp_auth_user");
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
