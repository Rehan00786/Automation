import { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { isMicrosoftAuthConfigured, graphMailScopes } from "../services/microsoft-auth";

export default function Login() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/mail" replace />;
  }

  async function signIn() {
    setError("");
    try {
      await instance.loginRedirect({ scopes: graphMailScopes });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Microsoft sign-in could not be started.");
    }
  }

  return (
    <main className="login">
      <section className="card">
        <h1>SAP Access Automation</h1>
        {isMicrosoftAuthConfigured ? (
          <>
            <p>Sign in with your work or school account to access mailbox intake.</p>
            <button className="primary-button" onClick={() => void signIn()} type="button">
              Sign in with Microsoft
            </button>
            {error && <p className="error-message" role="alert">{error}</p>}
          </>
        ) : (
          <>
            <p>Microsoft sign-in needs an Entra app registration before you can continue.</p>
            <p>Set VITE_ENTRA_CLIENT_ID and VITE_ENTRA_TENANT_ID in frontend/.env.</p>
          </>
        )}
      </section>
    </main>
  );
}
