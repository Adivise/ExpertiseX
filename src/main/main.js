import { app, shell, BrowserWindow, dialog } from 'electron';
import { electronApp } from '@electron-toolkit/utils';
import { clearAllLogs } from './utils/index.js';
import { setupIpcHandlers } from './ipc/handlers.js';
import { createWindow } from './window.js';
import { autoUpdater } from 'electron-updater';

// App Lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.expertise');
  clearAllLogs();
  const mainWindow = createWindow();
  setupIpcHandlers(mainWindow);
  setTimeout(checkForUpdates, 3000);

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

// Set feed URL for public repository
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'Adivise',
  repo: 'ExpertiseX'
});

// Check for updates
function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

// Auto-updater events
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: `Version ${info.version} is available for download.`,
    buttons: ['Download', 'Later'],
    defaultId: 0
  }).then(({ response }) => {
    if (response === 0) {
      shell.openExternal('https://github.com/Adivise/ExpertiseX/releases/latest');
    }
  });
});