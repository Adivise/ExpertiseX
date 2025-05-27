import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import * as dotenv from "dotenv";

dotenv.config();

const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("electronAPI", {
      // ✅ Detect when Electron window is closing
      onWindowClose: (callback) => ipcRenderer.on("window-closing", callback),
      // ✅ Start bot with token & port
      startBot: (token, port) => ipcRenderer.send("start-bot", token, port),
      // ✅ Chech token validity
      checkToken: (token) => ipcRenderer.invoke("invalid-token", token),
      // ✅ Bot Logging
      getBotLogs: () => ipcRenderer.invoke("get-bot-logs"),
      // ✅ Environment variable for development
      getEnv: () => ({ ip: process.env.IP || "localhost" }),
      // ✅ Check port availability
      checkPort: (port) => ipcRenderer.invoke("check-port", port),
      // ✅ Remove listener for bot logs
      removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
    });
  } catch (error) {
    console.error("Error exposing Electron API:", error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}

ipcRenderer.setMaxListeners(20); // ✅ Increase listener limit