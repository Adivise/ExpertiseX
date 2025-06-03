"use strict";
const electron = require("electron");
const path = require("path");
const utils$1 = require("@electron-toolkit/utils");
const child_process = require("child_process");
const net = require("net");
const fs = require("fs");
const discord_jsSelfbotV13 = require("discord.js-selfbot-v13");
const https = require("https");
const icon = path.join(__dirname, "../../resources/icon.png");
const PATHS = {
  CREDENTIALS: path.join(process.cwd(), "credentials.json"),
  FFMPEG: path.join(process.cwd(), "ffmpeg.exe"),
  CONFIG: path.join(process.cwd(), "config.json")
};
let botProcesses = /* @__PURE__ */ new Map();
let mainWindow = null;
const utils = {
  clearAllLogs: () => {
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
  },
  writeLog: (message, userId) => {
    if (!userId) return;
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    const logPath = path.join(process.cwd(), `${userId}.log`);
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
const discordClient = {
  isValidToken: async (token, shouldSave) => {
    const client = new discord_jsSelfbotV13.Client();
    try {
      await client.login(token);
      const username = client.user?.username || "";
      const id = client.user?.id || "";
      if (shouldSave) {
        await credentialsManager.saveCredential(token, username, id);
      }
      return { valid: true, username, id };
    } catch (err) {
      console.error("Invalid token:", err);
      return { valid: false };
    } finally {
      client.destroy();
    }
  }
};
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
      credentials = credentials.filter((cred) => cred.token !== token);
      fs.writeFileSync(PATHS.CREDENTIALS, JSON.stringify(credentials), "utf-8");
    } catch (error) {
      console.error("Error deleting credential:", error);
    }
  }
};
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
const setupIpcHandlers = () => {
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
  electron.ipcMain.handle("check-port", (_, port) => utils.isPortAvailable(port));
  electron.ipcMain.on("start-bot", (_, token, port, userId) => botManager.startBot(token, port, userId));
  electron.ipcMain.on("stop-bot", (_, userId) => botManager.stopBot(userId));
  electron.ipcMain.handle("get-active-bots", () => botManager.getActiveBots());
};
const createWindow = () => {
  mainWindow = new electron.BrowserWindow({
    width: 1500,
    height: 1e3,
    show: true,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      sandbox: false
    }
  });
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https:",
          "connect-src 'self' http://localhost:*"
        ].join("; ")
      }
    });
  });
  if (utils$1.is.dev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.setMenu(null);
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  if (utils$1.is.dev) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../out/renderer/index.html"));
  }
  mainWindow.on("close", () => {
    mainWindow.webContents.send("window-closing");
  });
};
electron.app.whenReady().then(() => {
  utils$1.electronApp.setAppUserModelId("com.expertise");
  utils.clearAllLogs();
  setupIpcHandlers();
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
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
