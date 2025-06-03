import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("electronAPI", {
      onWindowClose: (callback) => ipcRenderer.on("window-closing", callback),
      startBot: (token, port, userId) => ipcRenderer.send("start-bot", token, port, userId),
      stopBot: (userId) => ipcRenderer.send("stop-bot", userId),
      getActiveBots: () => ipcRenderer.invoke("get-active-bots"),
      checkToken: (token, shouldSave) => ipcRenderer.invoke("invalid-token", token, shouldSave),
      getBotLogs: (userId) => ipcRenderer.invoke("get-bot-logs", userId),
      checkPort: (port) => ipcRenderer.invoke("check-port", port),
      removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
      getCredentials: () => ipcRenderer.invoke("get-credentials"),
      deleteCredential: (token) => ipcRenderer.invoke("delete-credential", token),
      checkFFmpeg: () => ipcRenderer.invoke("check-ffmpeg"),
      downloadFFmpeg: () => ipcRenderer.invoke("download-ffmpeg"),
      loadConfig: () => ipcRenderer.invoke("load-config"),
      saveConfig: (config) => ipcRenderer.invoke("save-config", config),
      checkConfig: () => ipcRenderer.invoke("check-config"),
      getVersion: () => process.env.npm_package_version || '2.5.0'
    });
  } catch (error) {
    console.error("Error exposing Electron API:", error);
  }
}

ipcRenderer.setMaxListeners(20); // ✅ Increase listener limit