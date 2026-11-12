import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MailInbox from "./pages/MailInbox";
import Clients from "./pages/Clients";
import Requests from "./pages/Requests";
import RequestDetails from "./pages/RequestDetails";
import RoleSuggestions from "./pages/RoleSuggestions";
import SodAnalysis from "./pages/SodAnalysis";
import ManagerApprovals from "./pages/ManagerApprovals";
import SecurityApprovals from "./pages/SecurityApprovals";
import Provisioning from "./pages/Provisioning";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";

const pages = [
  ["Dashboard", "/dashboard"],
  ["Mailbox intake", "/mail"],
  ["Clients", "/clients"],
  ["Requests", "/requests"],
  ["Manager approvals", "/approvals/manager"],
  ["Security approvals", "/approvals/security"],
  ["Role suggestions", "/roles"],
  ["SoD analysis", "/sod"],
  ["Provisioning", "/provisioning"],
  ["Audit logs", "/audit"],
  ["Settings", "/settings"],
] as const;

function Shell() {
  const { instance } = useMsal();
  const [authError, setAuthError] = useState("");

  async function signOut() {
    setAuthError("");
    try {
      await instance.logoutRedirect();
    } catch (cause) {
      setAuthError(cause instanceof Error ? cause.message : "Microsoft sign-out failed.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/dashboard">
          <img src="/logo.svg" alt="" />
          <span>SAP Access</span>
        </Link>
        <nav aria-label="Main navigation">
          {pages.map(([label, path]) => (
            <Link key={path} to={path}>{label}</Link>
          ))}
          <button className="nav-button" onClick={() => void signOut()} type="button">
            Sign out
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {authError && <p className="error-message" role="alert">{authError}</p>}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mail" element={<MailInbox />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/:requestId" element={<RequestDetails />} />
          <Route path="/roles" element={<RoleSuggestions />} />
          <Route path="/sod" element={<SodAnalysis />} />
          <Route path="/approvals/manager" element={<ManagerApprovals />} />
          <Route path="/approvals/security" element={<SecurityApprovals />} />
          <Route path="/provisioning" element={<Provisioning />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={<AuthenticatedShell />}
      />
    </Routes>
  );
}

function AuthenticatedShell() {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <Shell /> : <Navigate to="/login" replace />;
}
