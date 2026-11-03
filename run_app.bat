@echo off
title AgriCare AI - Farmer Assistance Platform
color 0A

echo ===================================================
echo        AgriCare AI - Launching Platform
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting AgriCare AI Backend Server (FastAPI + PyTorch CUDA)...
start "AgriCare AI - Backend" cmd /k "cd /d "%~dp0" && .venv\Scripts\python -m uvicorn server:app --app-dir backend --host 127.0.0.1 --port 8000"

timeout /t 3 >nul

echo [2/2] Starting AgriCare AI Frontend Application (Vite React)...
start "AgriCare AI - Frontend" cmd /k "cd /d "%~dp0AgriCare-AI-project\AgriCare-AI" && npm run dev"

timeout /t 3 >nul

echo.
echo Opening AgriCare AI in your browser...
start http://127.0.0.1:5173/disease-detection

echo.
echo ===================================================
echo AgriCare AI is now running!
echo   Frontend : http://127.0.0.1:5173/
echo   Backend  : http://127.0.0.1:8000/
echo   API Docs : http://127.0.0.1:8000/docs
echo ===================================================
echo Keep the backend and frontend terminal windows open.
pause
