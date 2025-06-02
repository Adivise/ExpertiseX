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
  LOG: join(process.cwd(), "bot.log"),
  CREDENTIALS: join(process.cwd(), "credentials.json"),
  FFMPEG: join(process.cwd(), "ffmpeg.exe"),
  CONFIG: join(process.cwd(), "config.json")
};

// State
let botProcess = null;
let mainWindow = null;

// Utility Functions
const writeLog = (message) => {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  fs.appendFileSync(PATHS.LOG, `[${timestamp}] | ${message}`);
};

const isPortAvailable = (port) => {
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
};

const isValidToken = async (token, shouldSave) => {
  const client = new Client();
  try {
    await client.login(token);
    const username = client.user?.username || "";
    
    if (shouldSave) {
      await saveCredential(token, username);
    }
    
    return { valid: true, username };
  } catch (err) {
    console.error("Invalid token:", err);
    return { valid: false };
  } finally {
    client.destroy();
  }
};

const saveCredential = async (token, username) => {
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

  const index = credentials.findIndex((cred) => cred.token === token);
  const newCredential = { token, username };
  
  if (index === -1) {
    credentials.push(newCredential);
  } else {
    credentials[index] = newCredential;
  }

  fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials), "utf-8");
};

// IPC Handlers
const setupIpcHandlers = () => {
  // Config handlers
  ipcMain.handle('load-config', async () => {
    try {
      if (fs.existsSync(PATHS.CONFIG)) {
        const data = fs.readFileSync(PATHS.CONFIG, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error parsing config file:", error);
    }
    return null;
  });

  ipcMain.handle('save-config', (_, config) => {
    try {
      fs.writeFileSync(PATHS.CONFIG, JSON.stringify(config, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error("Error saving config file:", error);
      return false;
    }
  });

  ipcMain.handle('check-config', () => fs.existsSync(PATHS.CONFIG));

  // FFmpeg handlers
  ipcMain.handle("check-ffmpeg", () => fs.existsSync(PATHS.FFMPEG));

  ipcMain.handle("download-ffmpeg", async () => {
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
  });

  // Log handlers
  ipcMain.handle("get-bot-logs", () => {
    if (!fs.existsSync(PATHS.LOG)) return "No logs found.";
    return fs.readFileSync(PATHS.LOG, "utf8");
  });

  // Credential handlers
  ipcMain.handle("get-credentials", () => {
    try {
      if (fs.existsSync(PATHS.CREDENTIALS)) {
        const data = fs.readFileSync(PATHS.CREDENTIALS, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading credentials:", error);
    }
    return null;
  });

  ipcMain.handle("delete-credential", (_, token) => {
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
  });

  ipcMain.handle("invalid-token", (_, token, shouldSave) => isValidToken(token, shouldSave));
  ipcMain.handle('check-port', (_, port) => isPortAvailable(port));

  // Bot control handlers
  ipcMain.on('start-bot', (event, token, port) => {
    const backendPath = join(__dirname, '../../out/backend/index.js');
    botProcess = fork(backendPath, [token, port], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    if (botProcess.stdout) {
      botProcess.stdout.on("data", (data) => writeLog(`[🟢] ${data.toString()}`));
    }

    if (botProcess.stderr) {
      botProcess.stderr.on("data", (data) => writeLog(`[❌] ${data.toString()}`));
    }

    botProcess.on("close", (code) => writeLog(`[🛑] ${code}`));
    botProcess.on("error", (err) => writeLog(`[❌] ${err}`));
  });
};

// Window Management
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1235,
    height: 900,
    show: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    }
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

  fs.writeFileSync(PATHS.LOG, ""); // Clear logs on startup

  mainWindow.on('close', () => {
    mainWindow.webContents.send('window-closing');
  });
};

// App Lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.expertise');
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