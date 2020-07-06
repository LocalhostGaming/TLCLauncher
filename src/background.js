/* eslint-disable */
'use strict'

import { app, protocol, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';
const primaryInstance = app.requestSingleInstanceLock();

const imageIcon = path.join(path.dirname(__dirname), 'extra', 'icon.ico');
const ico = nativeImage.createFromPath(imageIcon);
/* eslint-enable */

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let launcherWindow = null;
let launcherTray = null;

console.log = console.info;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged(
  [
    {
      scheme: 'app',
      privileges: {
        secure: true,
        standard: true,
      },
    },
  ],
);

const createWindow = () => {
  // Create the browser window.
  launcherWindow = new BrowserWindow({
    width: 840,
    height: 650,
    frame: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  launcherWindow.setMaximizable(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    launcherWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) launcherWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    launcherWindow.loadURL('app://./index.html');
  }

  // On Hide, Add to System Tray
  launcherWindow.on('hide', () => {
    launcherTray = new Tray(ico);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Launcher',
        click: () => {
          launcherWindow.show();
          launcherWindow.setAlwaysOnTop(true);
        },
      },
      {
        label: 'Exit',
        click: () => {
          app.isQuiting = true;
          launcherWindow.destroy();
          app.quit();
        },
      },
    ]);

    launcherTray.setToolTip('TLC Launcher');
    launcherTray.setContextMenu(contextMenu);

    launcherTray.on('right-click', () => {
      launcherTray.popUpContextMenu();
    });

    launcherTray.on('double-click', () => {
      launcherWindow.show();
    });
  });

  launcherWindow.on('show', () => {
    if (launcherTray) {
      launcherTray.destroy();
      launcherTray = null;
    }
  });

  launcherWindow.on('closed', () => {
    if (launcherWindow) {
      launcherWindow = null;
    }
  });
};

if (!primaryInstance) {
  app.quit();
} else {
  app.on('second-instance', () => { // event, commandLine, workingDirectory
    // Someone tried to run a second instance, we should focus our window.
    if (launcherWindow) {
      if (launcherWindow.isMinimized()) launcherWindow.restore();
      launcherWindow.focus();
    }
  });

  app.on('session-created', (session) => {
    console.log(session);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (launcherWindow === null) {
      createWindow();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    if (isDevelopment) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString());
      }
    }

    createWindow();
  });

  // remove so we can register each time as we run the app.
  app.removeAsDefaultProtocolClient('lostlauncher');

  // If we are running a non-packaged version of the app && on windows
  if (isDevelopment) {
    // Set the path of electron.exe and your app.
    // These two additional parameters are only available on windows.
    app.setAsDefaultProtocolClient('lostlauncher', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('lostlauncher');
  }
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
