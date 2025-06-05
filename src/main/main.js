import { app, shell } from 'electron';
import { electronApp } from '@electron-toolkit/utils';
import { clearAllLogs } from './utils/index.js';
import { setupIpcHandlers } from './ipc/handlers.js';
import { createWindow } from './window.js';

// App Lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.expertise');
  clearAllLogs();
  const mainWindow = createWindow();
  setupIpcHandlers(mainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});