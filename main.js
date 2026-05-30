const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    focusable: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
}

ipcMain.on("mouse-move", (event, { x, y }) => {
  const bounds = mainWindow.getBounds();
  mainWindow.setBounds({
    x: bounds.x + x,
    y: bounds.y + y,
    width: bounds.width,
    height: bounds.height,
  });
});

ipcMain.on("close-app", () => {
  app.quit();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
