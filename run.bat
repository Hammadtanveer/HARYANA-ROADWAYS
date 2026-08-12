@echo off
title Haryanvi Roadways Radio Server
echo ===================================================
echo   HARYANA ROADWAYS CINEMATIC EXPERIENCE
echo ===================================================
echo.
echo   Starting local HTTP server via Python on Port 8000...
echo   (This is required to bypass YouTube's embed restrictions!)
echo.
start "" python -m http.server 8000
timeout /t 2 >nul
echo   Opening website in browser...
start http://localhost:8000
echo.
echo   Server is running. Close this window to stop.
echo ===================================================
pause
