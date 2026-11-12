import { useCallback, useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { listRecentMessages, type MailMessage } from "../services/graph-mail.service";
import { sharedMailbox } from "../services/microsoft-auth";

export default function MailInbox() {
  const { instance, accounts } = useMsal();
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = useCallback(async () => {
    const account = instance.getActiveAccount() ?? accounts[0];
    if (!account) {
      setError("Sign in with Microsoft to read mailbox messages.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      setMessages(await listRecentMessages(instance, account));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load messages from Microsoft Graph.");
    } finally {
      setLoading(false);
    }
  }, [accounts, instance]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  return (
    <>
      <header className="page-header">
        <h1>Mailbox intake</h1>
        <p>
          Read-only preview of the latest 25 inbox messages
          {sharedMailbox ? ` from ${sharedMailbox}` : " from your signed-in mailbox"}.
        </p>
      </header>
      <section className="card">
        <div className="inbox-toolbar">
          <h2>Recent messages</h2>
          <button className="secondary-button" onClick={() => void loadMessages()} type="button">
            Refresh
          </button>
        </div>
        {loading && <p role="status">Loading messages…</p>}
        {error && <p className="error-message" role="alert">{error}</p>}
        {!loading && !error && messages.length === 0 && <p>No messages found in this inbox.</p>}
        {!loading && !error && messages.length > 0 && (
          <div className="message-list">
            {messages.map((message) => (
              <article className="message-row" key={message.id}>
                <div>
                  <strong>{message.subject || "(No subject)"}</strong>
                  <div className="message-sender">
                    {message.from?.emailAddress?.name || message.from?.emailAddress?.address || "Unknown sender"}
                  </div>
                </div>
                <time dateTime={message.receivedDateTime}>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(message.receivedDateTime))}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
