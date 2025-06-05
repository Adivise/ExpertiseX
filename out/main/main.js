"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const path = require("path");
const net = require("net");
const https = require("https");
const discord_jsSelfbotV13 = require("discord.js-selfbot-v13");
const child_process = require("child_process");
const clearAllLogs = () => {
  try {
    const files = fs.readdirSync(process.cwd());
    files.forEach((file) => {
      if (file.endsWith(".log")) {
        fs.writeFileSync(path.join(process.cwd(), file), "");
      }
    });
  } catch (err) {
    console.error("Error clearing logs:", err);
  }
};
const writeLog = (message, userId) => {
  if (!userId) return;
  const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const logPath = path.join(process.cwd(), `${userId}.log`);
  fs.appendFileSync(logPath, `[${timestamp}] | ${message}`);
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
const PATHS = {
  CREDENTIALS: path.join(process.cwd(), "credentials.json"),
  FFMPEG: path.join(process.cwd(), "ffmpeg.exe"),
  CONFIG: path.join(process.cwd(), "config.json")
};
const configManager = {
  loadConfig: async () => {
    try {
      if (fs.existsSync(PATHS.CONFIG)) {
        const data = fs.readFileSync(PATHS.CONFIG, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error parsing config file:", error);
    }
    return null;
  },
  saveConfig: (config) => {
    try {
      fs.writeFileSync(PATHS.CONFIG, JSON.stringify(config, null, 2), "utf-8");
      return true;
    } catch (error) {
      console.error("Error saving config file:", error);
      return false;
    }
  },
  checkConfig: () => fs.existsSync(PATHS.CONFIG)
};
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
const credentialsManager = {
  saveCredential: async (token, username, id, avatar) => {
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
    const newCredential = { token, username, id, avatar };
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
      credentials = credentials.filter((cred) => cred.token !== token);
      fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials), "utf-8");
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  }
};
const discordClient = {
  isValidToken: async (token, shouldSave) => {
    const client = new discord_jsSelfbotV13.Client();
    try {
      await client.login(token);
      const username = client.user?.username || "";
      const id = client.user?.id || "";
      const avatar = client.user?.avatarURL() || "";
      if (shouldSave) {
        await credentialsManager.saveCredential(token, username, id, avatar);
      }
      return { valid: true, username, id, avatar };
    } catch (err) {
      console.error("Invalid token:", err);
      return { valid: false };
    } finally {
      client.destroy();
    }
  }
};
let botProcesses = /* @__PURE__ */ new Map();
const botManager = {
  startBot: (token, port, userId) => {
    const backendPath = path.join(__dirname, "../../out/backend/index.js");
    const botProcess = child_process.fork(backendPath, [token, port], {
      stdio: ["pipe", "pipe", "pipe", "ipc"]
    });
    botProcesses.set(userId, botProcess);
    if (userId) {
      fs.writeFileSync(path.join(process.cwd(), `${userId}.log`), "");
    }
    if (botProcess.stdout) {
      botProcess.stdout.on("data", (data) => writeLog(`[🟢] ${data.toString()}`, userId));
    }
    if (botProcess.stderr) {
      botProcess.stderr.on("data", (data) => writeLog(`[❌] ${data.toString()}`, userId));
    }
    botProcess.on("close", (code) => {
      writeLog(`[🛑] ${code}`, userId);
      botProcesses.delete(userId);
    });
    botProcess.on("error", (err) => {
      writeLog(`[❌] ${err}`, userId);
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
const setupIpcHandlers = (mainWindow2) => {
  electron.ipcMain.handle("load-config", configManager.loadConfig);
  electron.ipcMain.handle("save-config", (_, config) => configManager.saveConfig(config));
  electron.ipcMain.handle("check-config", configManager.checkConfig);
  electron.ipcMain.handle("check-ffmpeg", ffmpegManager.checkFFmpeg);
  electron.ipcMain.handle("download-ffmpeg", ffmpegManager.downloadFFmpeg);
  electron.ipcMain.handle("get-bot-logs", (_, userId) => {
    if (!userId) return "No user ID provided.";
    const logPath = path.join(process.cwd(), `${userId}.log`);
    if (!fs.existsSync(logPath)) return "No logs found.";
    return fs.readFileSync(logPath, "utf8");
  });
  electron.ipcMain.handle("get-credentials", credentialsManager.getCredentials);
  electron.ipcMain.handle("delete-credential", (_, token) => credentialsManager.deleteCredential(token));
  electron.ipcMain.handle("invalid-token", (_, token, shouldSave) => discordClient.isValidToken(token, shouldSave));
  electron.ipcMain.handle("check-port", (_, port) => isPortAvailable(port));
  electron.ipcMain.on("start-bot", (_, token, port, userId) => botManager.startBot(token, port, userId));
  electron.ipcMain.on("stop-bot", (_, userId) => botManager.stopBot(userId));
  electron.ipcMain.handle("get-active-bots", () => botManager.getActiveBots());
  electron.ipcMain.on("window-minimize", () => {
    if (mainWindow2) mainWindow2.minimize();
  });
  electron.ipcMain.on("window-maximize", () => {
    if (mainWindow2) {
      if (mainWindow2.isMaximized()) {
        mainWindow2.unmaximize();
      } else {
        mainWindow2.maximize();
      }
    }
  });
  electron.ipcMain.on("window-close", () => {
    if (mainWindow2) mainWindow2.close();
  });
};
const icon = path.join(__dirname, "../../resources/icon.png");
let mainWindow = null;
const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    width: 1500,
    height: 1e3,
    show: true,
    frame: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  });
  if (utils.is.dev) {
    mainWindow.webContents.openDevTools();
    process.env.NODE_ENV = "production";
  }
  mainWindow.setMenu(null);
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  if (utils.is.dev) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../out/renderer/index.html"));
  }
  return mainWindow;
};
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.expertise");
  clearAllLogs();
  const mainWindow2 = createWindow();
  setupIpcHandlers(mainWindow2);
  electron.app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });
  contents.setWindowOpenHandler(() => ({ action: "deny" }));
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
