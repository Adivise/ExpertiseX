"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
    electron.contextBridge.exposeInMainWorld("electronAPI", {
      onWindowClose: (callback) => electron.ipcRenderer.on("window-closing", callback),
      startBot: (token, port) => electron.ipcRenderer.send("start-bot", token, port),
      checkToken: (token, shouldSave) => electron.ipcRenderer.invoke("invalid-token", token, shouldSave),
      getBotLogs: () => electron.ipcRenderer.invoke("get-bot-logs"),
      checkPort: (port) => electron.ipcRenderer.invoke("check-port", port),
      removeListener: (channel, callback) => electron.ipcRenderer.removeListener(channel, callback),
      getCredentials: () => electron.ipcRenderer.invoke("get-credentials"),
      deleteCredential: (token) => electron.ipcRenderer.invoke("delete-credential", token),
      checkFFmpeg: () => electron.ipcRenderer.invoke("check-ffmpeg"),
      downloadFFmpeg: () => electron.ipcRenderer.invoke("download-ffmpeg"),
      loadConfig: () => electron.ipcRenderer.invoke("load-config"),
      saveConfig: (config) => electron.ipcRenderer.invoke("save-config", config),
      checkConfig: () => electron.ipcRenderer.invoke("check-config")
    });
  } catch (error) {
    console.error("Error exposing Electron API:", error);
  }
}
electron.ipcRenderer.setMaxListeners(20);
