import type { Configuration } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID?.trim() ?? "";
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID?.trim() ?? "";

export const isMicrosoftAuthConfigured = Boolean(clientId && tenantId);

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId || "00000000-0000-0000-0000-000000000000",
    authority: `https://login.microsoftonline.com/${tenantId || "organizations"}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const sharedMailbox = import.meta.env.VITE_GRAPH_MAILBOX?.trim() ?? "";

export const graphMailScopes = sharedMailbox
  ? ["User.Read", "Mail.Read.Shared"]
  : ["User.Read", "Mail.Read"];
