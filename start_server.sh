#!/bin/bash
# Build and Run FurniStyle Server

echo "========================================"
echo "Dream Furniture - E-Commerce System";
echo "========================================"
echo ""

# Check if backend folder exists
if [ ! -d "backend/src" ]; then
    echo "Error: backend/src folder not found!"
    exit 1
fi

echo "[1/3] Compiling Java backend..."
cd backend
javac -d . src/com/furniture/*.java src/com/furniture/models/*.java src/com/furniture/services/*.java src/com/furniture/controllers/*.java src/com/furniture/utils/*.java 2>/dev/null

if [ $? -eq 0 ]; then
    echo "[OK] Compilation successful!"
else
    echo "Error: Compilation failed!"
    exit 1
fi

echo ""
echo "[2/3] Starting FurniStyle Server..."
echo "Server will run on http://localhost:8080"
echo "Press Ctrl+C to stop the server."
echo ""

# Start the server
java com.furniture.FurnitureServer

cd ..
