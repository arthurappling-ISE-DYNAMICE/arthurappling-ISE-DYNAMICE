@echo off
:: ISE Health Console — Bulletproof Launch Script v3
:: Kills any stale process on port 3131, then restarts clean.
:: Use this as a manual override whenever needed.

echo.
echo  ===============================================
echo  ISE Health Console — Startup Guard Override
echo  Prime Pathwy Sovereign Systems
echo  ===============================================
echo.

cd /d "%~dp0"

:: ── Step 1: Kill any process holding port 3131 ─────────────────────────────
echo  Checking port 3131...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3131 " ^| findstr "LISTENING"') do (
    echo  Found stale process PID %%a — terminating...
    taskkill /F /PID %%a >nul 2>&1
)

:: Also kill any lingering node processes that match server.cjs by name
taskkill /F /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq node*server*" >nul 2>&1

timeout /t 1 /nobreak >nul

:: ── Step 2: Start fresh server ──────────────────────────────────────────────
echo  Starting ISE Health Console server...
start "" /B node server.cjs

:: ── Step 3: Wait for server ready ───────────────────────────────────────────
timeout /t 2 /nobreak >nul

:: ── Step 4: Open dashboard ──────────────────────────────────────────────────
echo  Opening dashboard at http://localhost:3131
start "" "http://localhost:3131"

echo.
echo  Console is live at http://localhost:3131
echo  Press Ctrl+C to stop the server.
echo.
