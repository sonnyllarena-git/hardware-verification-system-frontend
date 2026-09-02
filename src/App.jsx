import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ResultsListPage from "./pages/ResultsListPage";
import ResultDetailPage from "./pages/ResultDetailPage";
import SettingsPage from "./pages/SettingsPage";
import DownloadPage from "./pages/DownloadPage";
import CheckPage from "./pages/CheckPage";
import AppShell from "./components/AppShell";
import { isAuthenticated } from "./services/authService";

function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/check" element={<CheckPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/results" element={<ResultsListPage />} />
        <Route path="/results/:id" element={<ResultDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/download" element={<DownloadPage />} />
      </Route>
    </Routes>
  );
}

export default App;
