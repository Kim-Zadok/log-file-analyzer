@echo off
echo Starting Threat Intelligence Platform...

echo Starting backend server...
start cmd /k "cd src\backend && python -m uvicorn main:app --reload"

echo Starting frontend server...
start cmd /k "cd src\frontend && npm start"

echo Both servers are starting. The application will be available at:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs