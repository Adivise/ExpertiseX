import { BrowserWindow } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';

let mainWindow = null;

export const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    show: true,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  if (is.dev) {
    mainWindow.webContents.openDevTools();
    // Disable React DevTools warning
    process.env.NODE_ENV = 'production';
  }

  mainWindow.setMenu(null);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  if (is.dev) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../../out/renderer/index.html'));
  }

  return mainWindow;
};

export const getMainWindow = () => mainWindow; 