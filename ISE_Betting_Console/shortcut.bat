@echo off
cd /d "%~dp0"
echo.
echo   AA Betting Board -- ISE Dynamics V5 Supreme
echo   Starting server on http://localhost:3132
echo.
start "" "http://localhost:3132"
node server.cjs
