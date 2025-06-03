import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { fork } from 'child_process';
import net from 'net';
import fs from 'fs';
import { Client } from 'discord.js-selfbot-v13';
import https from 'https';

// Constants
const PATHS = {
  CREDENTIALS: join(process.cwd(), "credentials.json"),
  FFMPEG: join(process.cwd(), "ffmpeg.exe"),
  CONFIG: join(process.cwd(), "config.json")
};

// State
let botProcesses = new Map();
let mainWindow = null;

// Utility Functions
const utils = {
  clearAllLogs: () => {
    try {
      const files = fs.readdirSync(process.cwd());
      files.forEach(file => {
        if (file.endsWith('.log')) {
          fs.writeFileSync(join(process.cwd(), file), '');
        }
      });
    } catch (err) {
      console.error("Error clearing logs:", err);
    }
  },

  writeLog: (message, userId) => {
    if (!userId) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const logPath = join(process.cwd(), `${userId}.log`);
    fs.appendFileSync(logPath, `[${timestamp}] | ${message}`);
  },

  isPortAvailable: (port) => {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE") resolve(false);
        else resolve(true);
      });
      server.once("listening", () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
  }
};

// Discord Client Functions
const discordClient = {
  isValidToken: async (token, shouldSave) => {
    const client = new Client();
    try {
      await client.login(token);
      const username = client.user?.username || "";
      const id = client.user?.id || "";
      
      if (shouldSave) {
        await credentialsManager.saveCredential(token, username, id);
      }
      
      return { valid: true, username: username, id: id };
    } catch (err) {
      console.error("Invalid token:", err);
      return { valid: false };
    } finally {
      client.destroy();
    }
  }
};

// Credentials Manager
const credentialsManager = {
  saveCredential: async (token, username, id) => {
    let credentials = [];
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const fileContent = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        if (fileContent?.trim()) {
          credentials = JSON.parse(fileContent);
          if (!Array.isArray(credentials)) credentials = [];
        }
      }
    } catch (err) {
      console.error("Error reading credentials file:", err);
    }

    const index = credentials.findIndex((cred) => cred.id === id);
    const newCredential = { token, username, id };
    
    if (index === -1) {
      credentials.push(newCredential);
    } else {
      credentials[index] = newCredential;
    }

    fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials, null, 2), "utf-8");
  },

  getCredentials: () => {
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const data = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading credentials:", error);
    }
    return null;
  },

  deleteCredential: (token) => {
    try {
      let credentials = [];
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const fileContent = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        credentials = JSON.parse(fileContent);
        if (!Array.isArray(credentials)) credentials = [];
      }
      credentials = credentials.filter(cred => cred.token !== token);
      fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials), "utf-8");
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  }
};

// Bot Manager
const botManager = {
  startBot: (token, port, userId) => {
    const backendPath = join(__dirname, '../../out/backend/index.js');
    const botProcess = fork(backendPath, [token, port], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    botProcesses.set(userId, botProcess);

    if (userId) {
      fs.writeFileSync(join(process.cwd(), `${userId}.log`), "");
    }

    if (botProcess.stdout) {
      botProcess.stdout.on("data", (data) => utils.writeLog(`[🟢] ${data.toString()}`, userId));
    }

    if (botProcess.stderr) {
      botProcess.stderr.on("data", (data) => utils.writeLog(`[❌] ${data.toString()}`, userId));
    }

    botProcess.on("close", (code) => {
      utils.writeLog(`[🛑] ${code}`, userId);
      botProcesses.delete(userId);
    });
    
    botProcess.on("error", (err) => {
      utils.writeLog(`[❌] ${err}`, userId);
      botProcesses.delete(userId);
    });
  },

  stopBot: (userId) => {
    const botProcess = botProcesses.get(userId);
    if (botProcess) {
      botProcess.kill();
      botProcesses.delete(userId);
    }
  },

  getActiveBots: () => Array.from(botProcesses.keys())
};

// Config Manager
const configManager = {
  loadConfig: async () => {
    try {
      if (fs.existsSync(PATHS.CONFIG)) {
        const data = fs.readFileSync(PATHS.CONFIG, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error parsing config file:", error);
    }
    return null;
  },

  saveConfig: (config) => {
    try {
      fs.writeFileSync(PATHS.CONFIG, JSON.stringify(config, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error("Error saving config file:", error);
      return false;
    }
  },

  checkConfig: () => fs.existsSync(PATHS.CONFIG)
};

// FFmpeg Manager
const ffmpegManager = {
  checkFFmpeg: () => fs.existsSync(PATHS.FFMPEG),

  downloadFFmpeg: async () => {
    const initialUrl = "https://github.com/Adivise/ExpertiseX/releases/download/v2.0.0/ffmpeg.exe";
    
    const downloadFile = (url) => {
      return new Promise((resolve, reject) => {
        https.get(url, (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            return resolve(downloadFile(response.headers.location));
          }
          
          if (response.statusCode !== 200) {
            return reject(new Error(`Failed to download ffmpeg.exe. Status code: ${response.statusCode}`));
          }

          const fileStream = fs.createWriteStream(PATHS.FFMPEG);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve(true);
          });
        }).on("error", (err) => {
          fs.unlink(PATHS.FFMPEG, () => reject(err));
        });
      });
    };

    return downloadFile(initialUrl);
  }
};

// IPC Handlers Setup
const setupIpcHandlers = () => {
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
  ipcMain.handle('check-port', (_, port) => utils.isPortAvailable(port));

  // Bot control handlers
  ipcMain.on('start-bot', (_, token, port, userId) => botManager.startBot(token, port, userId));
  ipcMain.on('stop-bot', (_, userId) => botManager.stopBot(userId));
  ipcMain.handle('get-active-bots', () => botManager.getActiveBots());
};

// Window Management
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    show: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    }
  });

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https:",
          "connect-src 'self' http://localhost:*"
        ].join('; ')
      }
    });
  });

  if (is.dev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setMenu(null);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  if (is.dev) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../../out/renderer/index.html'));
  }

  mainWindow.on('close', () => {
    mainWindow.webContents.send('window-closing');
  });
};

// App Lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.expertise');
  utils.clearAllLogs();
  setupIpcHandlers();
  createWindow();

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