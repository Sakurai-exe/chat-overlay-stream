const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  mouseMove: (delta) => ipcRenderer.send("mouse-move", delta),
  closeApp: () => ipcRenderer.send("close-app"),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send("set-ignore-mouse-events", ignore),
  onGameModeChanged: (callback) => ipcRenderer.on("game-mode-changed", (_, value) => callback(value)),
});
