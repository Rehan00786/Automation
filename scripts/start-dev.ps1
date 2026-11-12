param(
    [switch]$WithDatabase
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$frontend = Join-Path $root "frontend"
$backend = Join-Path $root "backend"

if (-not (Test-Path (Join-Path $frontend "node_modules"))) {
    throw "Frontend dependencies are missing. Run .\scripts\setup.ps1 first."
}
if (-not (Test-Path (Join-Path $backend ".venv\Scripts\python.exe"))) {
    throw "Backend environment is missing. Run .\scripts\setup.ps1 first."
}

if ($WithDatabase) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw "Docker is required for -WithDatabase. Install and start Docker Desktop first."
    }
    docker compose -f (Join-Path $root "docker-compose.yml") up -d db
    if ($LASTEXITCODE -ne 0) {
        throw "Could not start the PostgreSQL container."
    }
}

$backendCommand = "Set-Location -LiteralPath '$backend'; & '.\.venv\Scripts\python.exe' -m uvicorn app.main:app --reload"
$frontendCommand = "Set-Location -LiteralPath '$frontend'; npm.cmd run dev"
$powershell = Join-Path $PSHOME "powershell.exe"
$encodedBackendCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($backendCommand))
$encodedFrontendCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($frontendCommand))
Start-Process -FilePath $powershell -WorkingDirectory $backend -ArgumentList @("-NoExit", "-EncodedCommand", $encodedBackendCommand)
Start-Process -FilePath $powershell -WorkingDirectory $frontend -ArgumentList @("-NoExit", "-EncodedCommand", $encodedFrontendCommand)
