const { app, components, BrowserWindow } = require('electron');
const { ipcMain } = require("electron"); // ipcMain is used to receive messages from the renderer process
const path = require('path');

// Dotenv for environment variables
require('dotenv').config()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 1200,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools. Comment this line to hide the DevTools.
  mainWindow.webContents.openDevTools();
};


app.whenReady(() => {
  // This is required to be set to false beginning in Electron v9 otherwise
  // the SerialPort module can not be loaded in Renderer processes like we are doing
  // in this example. The linked Github issues says this will be deprecated starting in v10,
  // however it appears to still be changed and working in v11.2.0
  // Relevant discussion: https://github.com/electron/electron/issues/18397
  app.allowRendererProcessReuse = false
})
  .then(async () => {
    // Load the components (CDM support)
    // If this is not awaited, the Spotify SDK will fail to initialize
    await components.whenReady();

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    createWindow();
  })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

