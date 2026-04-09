@echo off
:: ISE Health Console — Launch Script
:: Starts the local server and opens the dashboard in your default browser

echo.
echo  ISE Health Console
echo  Starting server at http://localhost:3131
echo.

cd /d "%~dp0"
start "" /B node server.cjs

:: Wait for server to be ready
timeout /t 2 /nobreak >nul

:: Open in default browser
start "" "http://localhost:3131"

echo  Dashboard launched. Press Ctrl+C to stop the server.
echo.
