const { app, BrowserWindow, Menu, shell, globalShortcut } = require('electron');
const path = require('path');
const express = require('express');
const http = require('http');

let mainWindow = null;
let serverInstance = null;
const PORT = 35678;

// Embedded local HTTP server to serve the SPA seamlessly with offline routing
function startEmbeddedServer() {
  return new Promise((resolve, reject) => {
    const serverApp = express();
    const distPath = path.join(__dirname, '..', 'dist');

    // Serve static files from dist/
    serverApp.use(express.static(distPath));

    // Fallback to index.html for React SPA client-side routing
    serverApp.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    const server = http.createServer(serverApp);
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Dragopedia Desktop] Servidor local activo en http://127.0.0.1:${PORT}`);
      serverInstance = server;
      resolve(`http://127.0.0.1:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port already in use, try connecting to it directly
        console.warn(`[Dragopedia Desktop] Puerto ${PORT} en uso, conectando...`);
        resolve(`http://127.0.0.1:${PORT}`);
      } else {
        reject(err);
      }
    });
  });
}

async function createWindow() {
  const iconPath = path.join(__dirname, '..', 'build', 'icon.ico');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Dragopedia — Caldo de Dragón',
    icon: iconPath,
    backgroundColor: '#0c1013',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  const appUrl = await startEmbeddedServer();

  await mainWindow.loadURL(appUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links (http/https not from our app) in user's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      if (!url.includes(`127.0.0.1:${PORT}`) && !url.includes(`localhost:${PORT}`)) {
        shell.openExternal(url);
        return { action: 'deny' };
      }
    }
    return { action: 'allow' };
  });

  // Native keyboard shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // F11: Toggle Fullscreen
    if (input.key === 'F11' && input.type === 'keyDown') {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
    }
    // Alt + Left: Go Back
    if (input.alt && input.key === 'ArrowLeft' && input.type === 'keyDown') {
      if (mainWindow.webContents.navigationHistory.canGoBack()) {
        mainWindow.webContents.navigationHistory.goBack();
        event.preventDefault();
      }
    }
    // Alt + Right: Go Forward
    if (input.alt && input.key === 'ArrowRight' && input.type === 'keyDown') {
      if (mainWindow.webContents.navigationHistory.canGoForward()) {
        mainWindow.webContents.navigationHistory.goForward();
        event.preventDefault();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single instance lock (prevent multiple app instances)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    await createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (serverInstance) {
    serverInstance.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
