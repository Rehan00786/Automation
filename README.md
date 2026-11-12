# SAP Access Request Automation

Starter workspace for a multi-client SAP access request and approval application.

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker Desktop (for PostgreSQL)

## Quick start (PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\start-dev.ps1
```

`setup.ps1` installs the frontend/backend dependencies and creates local `.env`
files. `start-dev.ps1` opens the frontend and backend in separate PowerShell
windows. Add `-WithDatabase` to start PostgreSQL as well; Docker Desktop must
be installed and running for that option.

The frontend runs at <http://localhost:5173>; the API and interactive docs
are at <http://localhost:8000> and <http://localhost:8000/docs>.

## Microsoft Graph mailbox connection

Register a single-tenant app in Microsoft Entra ID. Add a **Single-page
application** redirect URI of `http://localhost:5173` and delegated Graph
permissions `User.Read` and `Mail.Read`. Copy the app's client ID and directory
(tenant) ID into `frontend/.env` as `VITE_ENTRA_CLIENT_ID` and
`VITE_ENTRA_TENANT_ID`, then restart Vite. Choose **Grant admin consent** if
your organization requires administrator approval.

The app redirects you to Microsoft's sign-in page and reads inbox message
metadata only; it does not request passwords, store Graph tokens in the
backend, or modify messages. By default it reads the signed-in user's inbox.
For a shared mailbox, set `VITE_GRAPH_MAILBOX` and grant delegated
`Mail.Read.Shared` plus the signed-in user’s Exchange mailbox access. This
browser-based connection is for initial testing; production shared-mailbox
intake should use an admin-approved backend integration and credential
management.

The SAP RFC connector (`pyrfc`) is not installed by default: it requires the
SAP NetWeaver RFC SDK and compatible platform-specific setup. The included
mock adapter is intended for local development.
