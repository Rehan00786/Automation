import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";
import { msalConfig } from "./services/microsoft-auth";
import "./styles.css";

const msalInstance = new PublicClientApplication(msalConfig);

async function startApp() {
  await msalInstance.initialize();
  const redirectResult = await msalInstance.handleRedirectPromise();
  const account = redirectResult?.account ?? msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];
  if (account) {
    msalInstance.setActiveAccount(account);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    </React.StrictMode>,
  );
}

void startApp();
