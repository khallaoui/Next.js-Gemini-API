#!/bin/bash

echo "========================================"
echo "  Pension Management System - Frontend"
echo "========================================"
echo

echo "Checking if Spring Boot backend is running..."
if ! curl -s http://localhost:8080/api/dashboard/stats > /dev/null 2>&1; then
    echo
    echo "[WARNING] Spring Boot backend is not running!"
    echo "Please start the backend first:"
    echo "  1. Navigate to your Spring Boot project directory"
    echo "  2. Run: mvn spring-boot:run"
    echo "  3. Wait for it to start on http://localhost:8080"
    echo
    echo "Press Enter to continue anyway, or Ctrl+C to exit..."
    read
fi

echo
echo "Starting Next.js development server..."
echo "Frontend will be available at: http://localhost:9002"
echo

npm run dev