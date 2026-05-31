const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

let mainWindow;
let isGameMode = false;

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

  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setAlwaysOnTop(true, "pop-up-menu");
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

ipcMain.on("set-ignore-mouse-events", (event, ignore) => {
  mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
});

app.whenReady().then(() => {
  createWindow();

  // Ctrl+Alt+G — переключить игровой режим (прозрачный для мыши)
  globalShortcut.register("CommandOrControl+Alt+G", () => {
    isGameMode = !isGameMode;
    mainWindow.setIgnoreMouseEvents(isGameMode, { forward: true });
    mainWindow.setFocusable(!isGameMode);
    mainWindow.webContents.send("game-mode-changed", isGameMode);
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
