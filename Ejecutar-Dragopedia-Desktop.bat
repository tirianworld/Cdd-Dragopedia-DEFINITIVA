@echo off
cd /d "%~dp0"
title Dragopedia - Aplicacion de Escritorio

echo Iniciando Dragopedia como aplicacion de escritorio nativa...
call npm run electron:start
if %errorlevel% neq 0 (
    echo.
    echo Si es la primera vez que la ejecutas, instalando dependencias necesarias...
    call npm install
    call npm run build
    call npm run electron:start
)
