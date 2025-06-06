import { ipcMain } from 'electron';
import { configManager } from '../managers/config.js';
import { ffmpegManager } from '../managers/ffmpeg.js';
import { credentialsManager } from '../managers/credentials.js';
import { discordClient } from '../managers/discord.js';
import { botManager } from '../managers/bot.js';
import { sessionsManager } from '../managers/sessions.js';
import { isPortAvailable } from '../utils/index.js';
import fs from 'fs';
import { join } from 'path';

export const setupIpcHandlers = (mainWindow) => {
  // Config handlers
  ipcMain.handle('load-config', configManager.loadConfig);
  ipcMain.handle('save-config', (_, config) => configManager.saveConfig(config));
  ipcMain.handle('check-config', configManager.checkConfig);

  // FFmpeg handlers
  ipcMain.handle("check-ffmpeg", ffmpegManager.checkFFmpeg);
  ipcMain.handle("download-ffmpeg", ffmpegManager.downloadFFmpeg);

  // Log handlers
  ipcMain.handle("get-bot-logs", (_, userId) => {
    if (!userId) return "No user ID provided.";
    const logPath = join(process.cwd(), `${userId}.log`);
    if (!fs.existsSync(logPath)) return "No logs found.";
    return fs.readFileSync(logPath, "utf8");
  });

  // Credential handlers
  ipcMain.handle("get-credentials", credentialsManager.getCredentials);
  ipcMain.handle("delete-credential", (_, token) => credentialsManager.deleteCredential(token));
  ipcMain.handle("invalid-token", (_, token, shouldSave) => discordClient.isValidToken(token, shouldSave));
  ipcMain.handle('check-port', (_, port) => isPortAvailable(port));

  // Bot control handlers
  ipcMain.on('start-bot', (_, token, port, userId) => botManager.startBot(token, port, userId));
  ipcMain.on('stop-bot', (_, userId) => botManager.stopBot(userId));
  ipcMain.handle('get-active-bots', () => botManager.getActiveBots());

  // Window control handlers
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });

  // Session data handlers
  ipcMain.handle('save-session-data', (_, userId, sessionData) => sessionsManager.saveSessionData(userId, sessionData));
  ipcMain.handle('get-session-data', (_, userId) => sessionsManager.getSessionData(userId));
}; 