"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const dotenv = require("dotenv");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const dotenv__namespace = /* @__PURE__ */ _interopNamespaceDefault(dotenv);
dotenv__namespace.config();
const api = {};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
    electron.contextBridge.exposeInMainWorld("electronAPI", {
      onWindowClose: (callback) => electron.ipcRenderer.on("window-closing", callback),
      startBot: (token, port) => electron.ipcRenderer.send("start-bot", token, port),
      checkToken: (token) => electron.ipcRenderer.invoke("invalid-token", token),
      getBotLogs: () => electron.ipcRenderer.invoke("get-bot-logs"),
      getEnv: () => ({ ip: process.env.IP || "localhost" }),
      checkPort: (port) => electron.ipcRenderer.invoke("check-port", port),
      removeListener: (channel, callback) => electron.ipcRenderer.removeListener(channel, callback),
      storeToken: (token) => electron.ipcRenderer.invoke("store-token", token),
      getToken: () => electron.ipcRenderer.invoke("get-token"),
      checkFFmpeg: () => electron.ipcRenderer.invoke("check-ffmpeg"),
      downloadFFmpeg: () => electron.ipcRenderer.invoke("download-ffmpeg")
    });
  } catch (error) {
    console.error("Error exposing Electron API:", error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
electron.ipcRenderer.setMaxListeners(20);
