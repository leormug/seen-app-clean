const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    backgroundColor: "#ffffff",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // DEV: point to your running React dev server (port 3001)
  const devURL = process.env.ELECTRON_START_URL || "http://localhost:3001";

  if (process.env.ELECTRON_START_URL) {
    win.loadURL(devURL);
  } else {
    // PROD: load the built index.html
    win.loadFile(path.join(__dirname, "..", "build", "index.html"));
  }

  // Optional: open devtools in dev
  if (process.env.ELECTRON_START_URL) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
