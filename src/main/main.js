import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { fork } from 'child_process';
import net from 'net';
import fs from 'fs';
import { Client } from 'discord.js-selfbot-v13';

let botProcess;
const logFilePath = join(app.getPath("exe"), '../bot.log');

// Handle bot logs retrieval
ipcMain.handle("get-bot-logs", () => {
    return fs.readFileSync(logFilePath, "utf8") || "No logs found.";
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

  // Open links in the default browser
  main.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  });

  // Load the index.html of the app.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
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
      fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
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
    if (!botProcess) return; // If botProcess is not running, do nothing
    botProcess.kill(); // Stop the bot
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

app.on('before-quit', () => {
  if (botProcess) {
    botProcess.kill(); // Ensure the bot process is killed before quitting
  }
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