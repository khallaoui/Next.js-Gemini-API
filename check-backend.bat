@echo off
echo 🔍 Checking Backend Status
echo ========================

echo.
echo 1. Checking if anything is running on port 8080...
netstat -an | findstr :8080
if %errorlevel% equ 0 (
    echo ✅ Something is running on port 8080
) else (
    echo ❌ Nothing is running on port 8080
    echo.
    echo 💡 Your Spring Boot backend is not running!
    echo    To start it:
    echo    1. Navigate to your Spring Boot project directory
    echo    2. Run: mvn spring-boot:run
    echo    3. Or: ./mvnw spring-boot:run
    echo    4. Wait for "Started Application" message
)

echo.
echo 2. Testing basic connectivity...
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8080 2>nul
if %errorlevel% equ 0 (
    echo ✅ Backend responded
) else (
    echo ❌ Backend not responding
)

echo.
echo 3. Testing API endpoints...
echo Testing /api/pensioners:
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8080/api/pensioners 2>nul

echo.
echo Testing /api/affilies:
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8080/api/affilies 2>nul

echo.
echo Testing /api/allocataires:
curl -s -o nul -w "Status: %%{http_code}" http://localhost:8080/api/allocataires 2>nul

echo.
echo 📋 Summary:
echo ===========
echo - If you see "Nothing is running on port 8080": Start your Spring Boot app
echo - If you see "Status: 404": Your backend is running but missing endpoints
echo - If you see "Status: 200": Everything should be working!
echo.
pause