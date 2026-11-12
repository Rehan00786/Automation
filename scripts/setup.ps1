$ErrorActionPreference = "Stop"

Push-Location (Join-Path $PSScriptRoot "..")
try {
    Push-Location "frontend"
    npm.cmd install
    Pop-Location

    Push-Location "backend"
    if (-not (Test-Path ".venv")) {
        $pythonLauncher = Get-Command py -ErrorAction SilentlyContinue
        $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
        $uvCommand = Get-Command uv -ErrorAction SilentlyContinue

        if ($pythonLauncher) {
            py -m venv .venv
        } elseif ($pythonCommand -and $pythonCommand.Source -notlike "*\WindowsApps\*") {
            python -m venv .venv
        } elseif ($uvCommand) {
            uv venv .venv --python ">=3.11"
        } else {
            throw "Python 3.11+ is required. Install Python or uv, then run setup again."
        }
        if ($LASTEXITCODE -ne 0) {
            throw "Could not create the backend virtual environment."
        }
    }
    & ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
    & ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt
    Pop-Location

    if (-not (Test-Path "frontend\.env")) {
        Copy-Item "frontend\.env.example" "frontend\.env"
    }
    if (-not (Test-Path "backend\.env")) {
        Copy-Item "backend\.env.example" "backend\.env"
    }
} finally {
    Pop-Location
}
