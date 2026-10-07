@echo off
REM ============================================================
REM Ejecutar desde la raiz del proyecto (donde esta wrangler.toml)
REM Antes de ejecutar, copia en el proyecto:
REM   worker.ts   -> src\worker.ts  (sustituye al existente)
REM   .dev.vars   -> raiz del proyecto
REM   secrets.json-> raiz del proyecto
REM ============================================================

REM 1) Deshacer el commit bloqueado (solo si el ultimo commit es el que GitHub rechazo)
git reset --soft HEAD~1
git restore --staged .

REM 2) Evitar que se suban las claves
echo.>>.gitignore
echo .dev.vars>>.gitignore
echo secrets.json>>.gitignore
echo .env>>.gitignore
git rm --cached --ignore-unmatch .dev.vars secrets.json .env

REM 3) Desplegar el worker
call npx wrangler login
call npx wrangler deploy

REM 4) Subir las claves a Cloudflare
call npx wrangler secret bulk secrets.json

REM 5) Borrar el JSON con claves
del secrets.json

REM 6) Subir el codigo a GitHub (ya sin claves)
git add .
git commit -m "Worker con proveedores de IA"
git push

echo.
echo Listo. Prueba: https://TU-WORKER.workers.dev/api/ai/status
pause
