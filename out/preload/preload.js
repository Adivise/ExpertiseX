"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("electronAPI", {
      onWindowClose: (callback) => electron.ipcRenderer.on("window-closing", callback),
      startBot: (token, port, userId, avatar) => electron.ipcRenderer.send("start-bot", token, port, userId, avatar),
      stopBot: (userId) => electron.ipcRenderer.send("stop-bot", userId),
      getActiveBots: () => electron.ipcRenderer.invoke("get-active-bots"),
      checkToken: (token, shouldSave) => electron.ipcRenderer.invoke("invalid-token", token, shouldSave),
      getBotLogs: (userId) => electron.ipcRenderer.invoke("get-bot-logs", userId),
      checkPort: (port) => electron.ipcRenderer.invoke("check-port", port),
      removeListener: (channel, callback) => electron.ipcRenderer.removeListener(channel, callback),
      getCredentials: () => electron.ipcRenderer.invoke("get-credentials"),
      deleteCredential: (token) => electron.ipcRenderer.invoke("delete-credential", token),
      checkFFmpeg: () => electron.ipcRenderer.invoke("check-ffmpeg"),
      downloadFFmpeg: () => electron.ipcRenderer.invoke("download-ffmpeg"),
      loadConfig: () => electron.ipcRenderer.invoke("load-config"),
      saveConfig: (config) => electron.ipcRenderer.invoke("save-config", config),
      checkConfig: () => electron.ipcRenderer.invoke("check-config"),
      getVersion: () => process.env.npm_package_version || "2.6.0"
    });
  } catch (error) {
    console.error("Error exposing Electron API:", error);
  }
}
electron.ipcRenderer.setMaxListeners(20);
