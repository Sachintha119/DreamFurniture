@echo off
REM Quick Setup and Install Guide

echo ========================================
echo Dream Furniture - Quick Start Guide
echo ========================================
echo.

echo Step 1: Make sure you have Java installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java Development Kit (JDK) from https://www.oracle.com/java/
    pause
    exit /b 1
)

echo [OK] Java is installed
echo.

echo Step 2: Compile backend
cd backend
echo Compiling...
javac -d . src/com/furniture/*.java src/com/furniture/models/*.java src/com/furniture/services/*.java src/com/furniture/controllers/*.java src/com/furniture/utils/*.java

if %errorlevel% equ 0 (
    echo [OK] Backend compiled successfully!
) else (
    echo [ERROR] Compilation failed
    pause
    exit /b 1
)

cd ..
echo.

echo Step 3: Start the server
echo Running server on http://localhost:8080
echo.
echo Press Ctrl+C to stop.
echo.

java -cp backend com.furniture.FurnitureServer

pause
