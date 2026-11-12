import {
  InteractionRequiredAuthError,
  type AccountInfo,
  type IPublicClientApplication,
} from "@azure/msal-browser";
import { graphMailScopes, sharedMailbox } from "./microsoft-auth";

export type MailMessage = {
  id: string;
  subject: string;
  receivedDateTime: string;
  isRead: boolean;
  from?: {
    emailAddress?: {
      name?: string;
      address?: string;
    };
  };
};

type GraphMessageResponse = {
  value: MailMessage[];
};

type GraphErrorResponse = {
  error?: {
    message?: string;
  };
};

export async function listRecentMessages(
  instance: IPublicClientApplication,
  account: AccountInfo,
): Promise<MailMessage[]> {
  const tokenRequest = { scopes: graphMailScopes, account };
  let accessToken: string;

  try {
    const result = await instance.acquireTokenSilent(tokenRequest);
    accessToken = result.accessToken;
  } catch (error) {
    if (!(error instanceof InteractionRequiredAuthError)) {
      throw error;
    }
    await instance.acquireTokenRedirect(tokenRequest);
    throw new Error("Redirecting to Microsoft to grant mail-read permission.");
  }

  const mailboxPath = sharedMailbox
    ? `users/${encodeURIComponent(sharedMailbox)}`
    : "me";
  const query = new URLSearchParams({
    "$top": "25",
    "$orderby": "receivedDateTime desc",
    "$select": "id,subject,from,receivedDateTime,isRead",
  });
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/${mailboxPath}/mailFolders/inbox/messages?${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as GraphErrorResponse;
    throw new Error(
      errorBody.error?.message ?? `Microsoft Graph returned HTTP ${response.status}.`,
    );
  }

  const result = (await response.json()) as GraphMessageResponse;
  return result.value;
}
