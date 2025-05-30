"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const child_process = require("child_process");
const net = require("net");
const fs = require("fs");
const discord_jsSelfbotV13 = require("discord.js-selfbot-v13");
const https = require("https");
const icon = path.join(__dirname, "../../resources/icon.png");
let botProcess;
let logFilePath;
let credentialFilePath;
let ffmpegPath;
if (utils.is.dev) {
  logFilePath = path.join(__dirname, "../../bot.log");
  credentialFilePath = path.join(__dirname, "../../credentials.json");
  ffmpegPath = path.join(__dirname, "../../ffmpeg.exe");
} else {
  logFilePath = path.join(electron.app.getPath("exe"), "../bot.log");
  credentialFilePath = path.join(electron.app.getPath("exe"), "../credentials.json");
  ffmpegPath = path.join(electron.app.getPath("exe"), "../ffmpeg.exe");
}
electron.ipcMain.handle("check-ffmpeg", async () => {
  return fs.existsSync(ffmpegPath);
});
electron.ipcMain.handle("download-ffmpeg", async () => {
  const initialUrl = "https://github.com/Adivise/ExpertiseX/releases/download/v2.0.0/ffmpeg.exe";
  const downloadFile = (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return resolve(downloadFile(response.headers.location));
        } else if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to download ffmpeg.exe. Status code: ${response.statusCode}`)
          );
        }
        const fileStream = fs.createWriteStream(ffmpegPath);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve(true);
        });
      }).on("error", (err) => {
        fs.unlink(ffmpegPath, () => reject(err));
      });
    });
  };
  return downloadFile(initialUrl);
});
electron.ipcMain.handle("get-bot-logs", () => {
  if (!fs.existsSync(logFilePath)) ;
  return fs.readFileSync(logFilePath, "utf8") || "No logs found.";
});
electron.ipcMain.handle("get-credentials", () => {
  if (fs.existsSync(credentialFilePath)) {
    const data = fs.readFileSync(credentialFilePath, "utf-8");
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
  return null;
});
electron.ipcMain.handle("delete-credential", (_, token) => {
  let credentials = [];
  if (fs.existsSync(credentialFilePath)) {
    try {
      const fileContent = fs.readFileSync(credentialFilePath, "utf-8");
      credentials = JSON.parse(fileContent);
      if (!Array.isArray(credentials)) credentials = [];
    } catch (err) {
    }
  }
  credentials = credentials.filter((cred) => cred.token !== token);
  fs.writeFileSync(credentialFilePath, JSON.stringify(credentials), "utf-8");
  return;
});
electron.ipcMain.handle("invalid-token", async (_, token, shouldSave) => {
  return await isValidToken(token, shouldSave);
});
electron.ipcMain.handle("check-port", async (_, port) => {
  return await isPortAvailable(port);
});
function createWindow() {
  const main = new electron.BrowserWindow({
    width: 1235,
    height: 900,
    show: true,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      sandbox: false
    }
  });
  if (utils.is.dev) {
    main.webContents.openDevTools();
  }
  main.setMenu(null);
  main.on("ready-to-show", () => {
    main.show();
  });
  if (utils.is.dev) {
    main.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    main.loadFile(path.join(__dirname, "../../out/renderer/index.html"));
  }
  fs.writeFileSync(logFilePath, "");
  electron.ipcMain.on("start-bot", (event, token, port) => {
    const backendPath = path.join(__dirname, "../../out/backend/index.js");
    botProcess = child_process.fork(backendPath, [token, port], {
      stdio: ["pipe", "pipe", "pipe", "ipc"]
    });
    function writeLog(message) {
      const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      fs.appendFileSync(logFilePath, `[${timestamp}] | ${message}`);
    }
    if (botProcess.stdout) {
      botProcess.stdout.on("data", (data) => {
        writeLog(`[🟢] ${data.toString()}`);
      });
    } else {
      console.error("botProcess.stdout is null");
    }
    if (botProcess.stderr) {
      botProcess.stderr.on("data", (data) => {
        writeLog(`[❌] ${data.toString()}`);
      });
    } else {
      console.error("botProcess.stderr is null");
    }
    botProcess.on("close", (code) => {
      writeLog(`[🛑] ${code}`);
    });
    botProcess.on("error", (err) => {
      writeLog(`[❌] ${err}`);
    });
  });
  main.on("close", () => {
    main.webContents.send("window-closing");
  });
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.expertise");
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });
  contents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
function isPortAvailable(port) {
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
function isValidToken(token, shouldSave) {
  return new Promise((resolve) => {
    const client = new discord_jsSelfbotV13.Client();
    client.login(token).then(() => {
      const username = client.user ? client.user.username : "";
      if (shouldSave) {
        const newCredential = { token, username };
        let credentials = [];
        if (fs.existsSync(credentialFilePath)) {
          try {
            const fileContent = fs.readFileSync(credentialFilePath, "utf-8");
            if (fileContent && fileContent.trim()) {
              credentials = JSON.parse(fileContent);
              if (!Array.isArray(credentials)) {
                credentials = [];
              }
            }
          } catch (err) {
            console.error("Error parsing credentials file, starting with an empty array.", err);
            credentials = [];
          }
        }
        const index = credentials.findIndex((cred) => cred.token === token);
        if (index === -1) {
          credentials.push(newCredential);
        } else {
          credentials[index] = newCredential;
        }
        fs.writeFileSync(credentialFilePath, JSON.stringify(credentials), "utf-8");
      }
      client.destroy();
      resolve({ valid: true, username });
    }).catch((err) => {
      console.error("Invalid token:", err);
      resolve({ valid: false });
    });
  });
}
