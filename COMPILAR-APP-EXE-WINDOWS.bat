@echo off
setlocal enabledelayedexpansion
title Dragopedia - Compilador de Aplicacion de Escritorio Windows (.exe)

echo =====================================================================
echo           DRAGOPEDIA - GENERADOR DE EJECUTABLE WINDOWS (.EXE)
echo =====================================================================
echo.
echo Este script creara un programa ejecutable nativo (.exe) para Windows
echo totalmente independiente del navegador, con instalador y version portable.
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] No se detecto Node.js instalado en tu sistema.
    echo Por favor instala Node.js (version 18 o superior) desde https://nodejs.org
    echo y vuelve a ejecutar este archivo.
    echo.
    pause
    exit /b 1
)

echo [1/3] Verificando dependencias del proyecto...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la instalacion de dependencias.
    pause
    exit /b 1
)

echo.
echo [2/3] Compilando la aplicacion web (Vite)...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la compilacion web.
    pause
    exit /b 1
)

echo.
echo [3/3] Empaquetando ejecutables nativos (.exe) con Electron Builder...
call npx electron-builder --win --x64
if %errorlevel% neq 0 (
    echo [ERROR] Fallo la creacion del ejecutable .exe.
    pause
    exit /b 1
)

echo.
echo =====================================================================
echo                   COMPILACION EXITOSA (.EXE)
echo =====================================================================
echo.
echo Se han generado tus ejecutables en la carpeta 'release':
echo   1. Dragopedia Setup 1.0.0.exe (Instalador para Windows)
echo   2. Dragopedia-Portable.exe     (Version portable directa)
echo.
echo Abriendo la carpeta con los ejecutables...
start "" "%~dp0release"
echo.
pause
