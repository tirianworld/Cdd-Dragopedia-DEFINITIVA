# 🐉 Dragopedia — Aplicación de Escritorio Nativa para PC (.exe)

Este proyecto incluye la arquitectura de **Electron** para empaquetar la **Dragopedia** como un programa independiente de Windows (`.exe`), sin barras de navegador y totalmente funcional offline.

---

## ⚡ Cómo generar el `.exe` en tu PC (1 Clic)

Si tienes descargado o clonado este repositorio en tu ordenador Windows:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
2. Haz doble clic en el archivo **`COMPILAR-APP-EXE-WINDOWS.bat`** situado en la raíz del proyecto.
3. El asistente se encargará de todo automáticamente y generará tus ejecutables dentro de la carpeta `release/`:
   * **`Dragopedia Setup 1.0.0.exe`**: Instalador para Windows (crea acceso directo en Escritorio y Menú Inicio).
   * **`Dragopedia-Portable.exe`**: Ejecutable portable (doble clic y se abre directamente sin instalación).

---

## 💻 Comandos Manuales de Consola

Si prefieres usar la terminal (`cmd` o `PowerShell`):

```bash
# 1. Instalar dependencias
npm install

# 2. Probar la aplicación de escritorio en modo local
npm run electron:start

# 3. Compilar los ejecutables .exe para Windows
npm run electron:build
```

---

## ⌨️ Atajos dentro de la Aplicación de Escritorio
* **F11**: Activar o desactivar pantalla completa.
* **Ctrl + R** o **F5**: Recargar la aplicación.
* **Alt + Flecha Izquierda**: Volver atrás en el compendio, grimorio o diario.
* **Alt + Flecha Derecha**: Avanzar página.
