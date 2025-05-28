import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { fork } from 'child_process';
import net from 'net';
import fs from 'fs';
import { Client } from 'discord.js-selfbot-v13';
import https from 'https';

let botProcess;

let logFilePath;
let tokenFilePath;
let ffmpegPath;

if (is.dev) {
  // In development, use paths relative to the current __dirname
  logFilePath = join(__dirname, "../../bot.log");
  tokenFilePath = join(__dirname, "../../token.txt");
  ffmpegPath = join(__dirname, "../../ffmpeg.exe");
} else {
  // In production builds, use the executable's directory.
  logFilePath = join(app.getPath("exe"), "../bot.log");
  tokenFilePath = join(app.getPath("exe"), "../token.txt");
  ffmpegPath = join(app.getPath("exe"), "../ffmpeg.exe");
}

// Handle for check ffmpeg.exe
ipcMain.handle("check-ffmpeg", async () => {
  return fs.existsSync(ffmpegPath);
});

// Handler to download FFmpeg if missing
ipcMain.handle("download-ffmpeg", async () => {
  const initialUrl = "https://github.com/Adivise/ExpertiseX/releases/download/v2.0.0/ffmpeg.exe";

  // Recursive function to follow redirects.
  const downloadFile = (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
          // If redirect status code detected and there's a location header, follow it.
          if (
            response.statusCode >= 300 &&
            response.statusCode < 400 &&
            response.headers.location
          ) {
            return resolve(downloadFile(response.headers.location));
          } else if (response.statusCode !== 200) {
            return reject(
              new Error(`Failed to download ffmpeg.exe. Status code: ${response.statusCode}`)
            );
          }

          // Download the file
          const fileStream = fs.createWriteStream(ffmpegPath);
          response.pipe(fileStream);
          fileStream.on("finish", () => {
            fileStream.close();
            resolve(true);
          });
        })
        .on("error", (err) => {
          // Clean up the file if any error occurred.
          fs.unlink(ffmpegPath, () => reject(err));
        });
    });
  };

  return downloadFile(initialUrl);
});

// Handle bot logs retrieval
ipcMain.handle("get-bot-logs", () => {
  if (!fs.existsSync(logFilePath));
  return fs.readFileSync(logFilePath, "utf8") || "No logs found.";
});

// Handle save token
ipcMain.handle("store-token", (_, token) => {
  if (!fs.existsSync(tokenFilePath));
  return fs.writeFileSync(tokenFilePath, token, "utf-8");
});

// Handle get token
ipcMain.handle("get-token", () => {
  if (fs.existsSync(tokenFilePath)) { // not have = return to null
    return fs.readFileSync(tokenFilePath, "utf-8");
  }
  return null;
});

// Handle invalid token
ipcMain.handle("invalid-token", async (_, token) => {
    return await isValidToken(token);
});

// Handle port checking
ipcMain.handle('check-port', async (_, port) => {
  return await isPortAvailable(port);
});

function createWindow() {
  // Create the browser window.
  const main = new BrowserWindow({
    width: 1235,
    height: 900,
    show: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      devTools: false,
    }
  });

  main.setMenu(null); // Hide the menu bar

  main.on('ready-to-show', () => {
    main.show();
  });

  // Load the index.html of the app.
  if (is.dev) {
    main.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    main.loadFile(join(__dirname, '../../out/renderer/index.html'));
  };

  fs.writeFileSync(logFilePath, ""); // Clear logs on startup

  ipcMain.on('start-bot', (event, token, port) => {
    const backendPath = join(__dirname, '../../out/backend/index.js');
    botProcess = fork(backendPath, [token, port], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    function writeLog(message) {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
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
  
  // Handle window closing
  main.on('close', () => {
    main.webContents.send('window-closing');
  });
}

// This method will be called when Electron has finished
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.expertise');
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Open links in the default browser
app.on("web-contents-created", (_, contents) => {
    contents.on("will-navigate", (event, url) => {
        event.preventDefault(); // ✅ Prevent Electron from navigating internally
        shell.openExternal(url); // ✅ Open link in default web browser
    });

    contents.setWindowOpenHandler(() => {
        return { action: "deny" }; // ✅ Block new windows entirely
    });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Check if port is available
function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err) => {
            if (err.code === "EADDRINUSE") resolve(false); // ❌ Port is taken
            else resolve(true);
        });

        server.once("listening", () => {
            server.close();
            resolve(true); // ✅ Port is free
        });

        server.listen(port);
    });
}

function isValidToken(token) {
    return new Promise((resolve) => {
        const client = new Client();

        client.login(token).then(() => {
            client.destroy(); // ✅ Clean up after successful login
            resolve(true); // ✅ Token is valid
        }).catch(() => {
            resolve(false); // ❌ Token is invalid
        });
    });
}