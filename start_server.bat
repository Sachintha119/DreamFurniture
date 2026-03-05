@echo off
REM Build and Run FurniStyle Server

echo ========================================
echo Dream Furniture - E-Commerce System
echo ========================================
echo.

REM Check if backend folder exists
if not exist "backend\src" (
    echo Error: backend\src folder not found!
    exit /b 1
)

echo [1/3] Compiling Java backend...
cd backend
javac -d . src/com/furniture/*.java src/com/furniture/models/*.java src/com/furniture/services/*.java src/com/furniture/controllers/*.java src/com/furniture/utils/*.java 2>nul

if %errorlevel% neq 0 (
    echo Error: Compilation failed!
    echo Trying individual compilation...
    javac -d . src/com/furniture/*.java
    javac -d . src/com/furniture/models/*.java
    javac -d . src/com/furniture/services/*.java
    javac -d . src/com/furniture/controllers/*.java
    javac -d . src/com/furniture/utils/*.java
)

if %errorlevel% equ 0 (
    echo [OK] Compilation successful!
) else (
    echo Error: Compilation failed!
    exit /b 1
)

echo.
echo [2/3] Starting FurniStyle Server...
echo Server will run on http://localhost:8080
echo Press Ctrl+C to stop the server.
echo.

REM Start the server
java com.furniture.FurnitureServer

cd ..

pause
