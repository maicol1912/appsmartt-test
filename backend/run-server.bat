@echo off
echo 🚀 Levantando Appsmartt Backend + Postgres con Docker Compose...

REM Reconstruir y levantar en segundo plano usando .env
docker-compose --env-file .env up --build -d

IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Hubo un error al ejecutar docker-compose
    exit /b %ERRORLEVEL%
)

echo ✅ Todo arriba! Puedes acceder en: http://localhost:3000
pause
