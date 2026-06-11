const { app, BrowserWindow } = require('electron');
const path = require('path');

// app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('in-process-gpu');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '3D Orbit',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
