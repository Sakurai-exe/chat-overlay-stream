const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  mouseMove: (delta) => ipcRenderer.send("mouse-move", delta),
  closeApp: () => ipcRenderer.send("close-app"),
});
