import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import ResultDetailPage from "./pages/ResultDetailPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import AdministrationPage from "./pages/AdministrationPage";
import DownloadPage from "./pages/DownloadPage";
import CheckPage from "./pages/CheckPage";
import AppShell from "./components/AppShell";
import { isAuthenticated, isAdmin, needsOnboarding } from "./services/authService";

// Any signed-in staff account can reach the app shell, but one that still needs the forced
// first-login flow (temp password not yet changed, or security questions not yet set — see
// OnboardingPage.jsx) is bounced there first, before Dashboard/Applicants/Settings/Administration
// become reachable at all.
function RequireAuth({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  if (needsOnboarding()) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function RequireOnboarding({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function RequireAdmin({ children }) {
  return isAdmin() ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/check" element={<CheckPage />} />
      <Route
        path="/onboarding"
        element={
          <RequireOnboarding>
            <OnboardingPage />
          </RequireOnboarding>
        }
      />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/applicants" element={<ApplicantsPage />} />
        <Route path="/results/:id" element={<ResultDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route
          path="/administration"
          element={
            <RequireAdmin>
              <AdministrationPage />
            </RequireAdmin>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
