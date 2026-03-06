@echo off
REM Start both Java backend and Python frontend servers

echo.
echo ========================================
echo Dream Furniture - Dual Server Startup
echo ========================================
echo.

REM Kill any existing Java processes
taskkill /F /IM java.exe >nul 2>&1

REM Kill any existing Python processes on port 3000
netstat -ano | findstr :3000 >nul && for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul

echo [1/2] Starting Java Backend Server on port 8080...
start "Dream Furniture Backend" java -cp backend com.furniture.FurnitureServer

echo [2/2] Starting Python Frontend Server on port 3000...
cd frontend
start "Dream Furniture Frontend" python -m http.server 3000
cd ..

timeout /t 3 /nobreak

echo.
echo ========================================
echo ✅ Servers Started Successfully!
echo ========================================
echo.
echo Frontend (User Panel):  http://localhost:3000
echo Products:              http://localhost:3000/pages/products.html
echo Admin Panel:           http://localhost:3000/admin/login.html
echo Backend API:           http://localhost:8080/api/products
echo.
echo For phone access:
echo - Replace 'localhost' with your laptop IP
echo - Example: http://192.168.x.x:3000
echo.
echo Or use ngrok for internet access:
echo - Run: ngrok http 3000
echo.
timeout /t 300 /nobreak
