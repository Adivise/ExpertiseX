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
let tokenFilePath;
let ffmpegPath;
if (utils.is.dev) {
  logFilePath = path.join(__dirname, "../../bot.log");
  tokenFilePath = path.join(__dirname, "../../token.txt");
  ffmpegPath = path.join(__dirname, "../../ffmpeg.exe");
} else {
  logFilePath = path.join(electron.app.getPath("exe"), "../bot.log");
  tokenFilePath = path.join(electron.app.getPath("exe"), "../token.txt");
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
electron.ipcMain.handle("store-token", (_, token) => {
  if (!fs.existsSync(tokenFilePath)) ;
  return fs.writeFileSync(tokenFilePath, token, "utf-8");
});
electron.ipcMain.handle("get-token", () => {
  if (fs.existsSync(tokenFilePath)) {
    return fs.readFileSync(tokenFilePath, "utf-8");
  }
  return null;
});
electron.ipcMain.handle("invalid-token", async (_, token) => {
  return await isValidToken(token);
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
      sandbox: false,
      devTools: false
    }
  });
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
function isValidToken(token) {
  return new Promise((resolve) => {
    const client = new discord_jsSelfbotV13.Client();
    client.login(token).then(() => {
      client.destroy();
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  });
}
