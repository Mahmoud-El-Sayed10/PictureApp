// main.cjs
const { app, BrowserWindow, ipcMain, dialog, shell, protocol } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const Store = require('electron-store');
const sharp = require('sharp');

const USER_DATA_PATH = app.getPath('userData');
const PICTURES_DIRECTORY = path.join(USER_DATA_PATH, 'UserPictures');
fs.ensureDirSync(PICTURES_DIRECTORY);

const store = new Store({
  schema: {
    albums: { type: 'object', default: {} },
    imageMetadata: { type: 'object', default: {} },
  },
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    },
  });

  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const url = request.url.replace(/^app:\/\/local-image\//, '');
      const filePath = path.join(PICTURES_DIRECTORY, url);
      const safePath = path.normalize(filePath);
      if (!safePath.startsWith(PICTURES_DIRECTORY)) {
        return callback({ error: -6 });
      }
      callback({ path: safePath });
    } catch (err) {
      console.error('Failed to register file protocol:', err);
      callback({ error: -6 });
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('load-images', async () => {
  try {
    const files = await fs.readdir(PICTURES_DIRECTORY);
    const imageFiles = files.filter((file) => /\.(jpe?g|png|gif|webp|bmp)$/i.test(file));

    const storedMetadata = store.get('imageMetadata', {});
    const imagesData = imageFiles.map((file) => {
      const imageId = path.parse(file).name;
      const meta = storedMetadata[imageId] || {
        title: imageId,
        relativePath: file
      };
      storedMetadata[imageId] = meta;

      return {
        id: imageId,
        src: `app://local-image/${file}`,
        title: meta.title,
      };
    });

    store.set('imageMetadata', storedMetadata);
    return imagesData;
  } catch (err) {
    console.error("Error loading images:", err);
    dialog.showErrorBox("Error", "Could not load images from directory.");
    return [];
  }
});

ipcMain.handle('delete-image', async (event, imageId) => {
  if (!imageId) return { success: false, error: 'No image ID provided.' };

  const storedMetadata = store.get('imageMetadata', {});
  const meta = storedMetadata[imageId];
  if (!meta || !meta.relativePath) {
    return { success: false, error: 'Image metadata not found.' };
  }

  const filePath = path.join(PICTURES_DIRECTORY, meta.relativePath);
  const safeFilePath = path.normalize(filePath);
  if (!safeFilePath.startsWith(PICTURES_DIRECTORY)) {
    console.error('Attempted to delete file outside safe directory:', safeFilePath);
    return { success: false, error: 'Invalid file path.' };
  }

  const confirmation = await dialog.showMessageBox({
    type: 'warning',
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    title: 'Confirm Delete',
    message: `Are you sure you want to permanently delete "${meta.title}"?`,
    detail: 'This action cannot be undone.'
  });

  if (confirmation.response === 1) {
    try {
      await fs.remove(safeFilePath);
      delete storedMetadata[imageId];
      store.set('imageMetadata', storedMetadata);

      const albums = store.get('albums', {});
      for (const albumName in albums) {
        albums[albumName] = albums[albumName].filter((id) => id !== imageId);
      }
      store.set('albums', albums);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting image ${imageId}:`, err);
      dialog.showErrorBox("Error", `Could not delete image: ${err.message}`);
      return { success: false, error: err.message };
    }
  } else {
    return { success: false, error: 'Deletion cancelled.' };
  }
});

ipcMain.handle('edit-image', async (event, inputPath, options) => {
  try {
    let image = sharp(inputPath);

    if (options.operation === 'crop') {
      image = image.extract({
        left: options.left,
        top: options.top,
        width: options.width,
        height: options.height,
      });
    } else if (options.operation === 'rotate') {
      image = image.rotate(options.angle || 90);
    } else if (options.operation === 'grayscale') {
      image = image.grayscale();
    } else if (options.operation === 'watermark') {
      const watermark = await sharp(options.watermarkPath)
        .resize({ width: options.width, height: options.height })
        .toBuffer();
      image = image.composite([{ input: watermark, blend: 'over', gravity: 'southeast' }]);
    }

    const outputPath = path.join(path.dirname(inputPath), `edited-${path.basename(inputPath)}`);
    await image.toFile(outputPath);

    return { success: true, outputPath };
  } catch (error) {
    console.error('Error editing image:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-albums', async () => {
  return store.get('albums', {});
});

ipcMain.handle('add-image-to-album', async (event, { imageId, albumName }) => {
  if (!imageId || !albumName) return { success: false, error: 'Missing image ID or album name.' };

  const albums = store.get('albums', {});
  if (!albums[albumName]) {
    albums[albumName] = [];
  }
  if (!albums[albumName].includes(imageId)) {
    albums[albumName].push(imageId);
    store.set('albums', albums);
  }
  return { success: true, albums };
});

ipcMain.handle('upload-image', async (event, filePaths) => {
  if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
    return { success: false, error: 'No files provided' };
  }

  try {
    const storedMetadata = store.get('imageMetadata', {});

    for (const filePath of filePaths) {
      const baseName = path.basename(filePath);
      const destPath = path.join(PICTURES_DIRECTORY, baseName);

      if (await fs.pathExists(destPath)) {
        const { name, ext } = path.parse(baseName);
        let counter = 1;
        let newName = `${name} (${counter})${ext}`;
        let newDest = path.join(PICTURES_DIRECTORY, newName);
        while (await fs.pathExists(newDest)) {
          counter++;
          newName = `${name} (${counter})${ext}`;
          newDest = path.join(PICTURES_DIRECTORY, newName);
        }
        await fs.copy(filePath, newDest);
        const imageId = path.parse(newName).name;
        storedMetadata[imageId] = {
          title: imageId,
          relativePath: newName,
        };
      } else {
        await fs.copy(filePath, destPath);
        const imageId = path.parse(baseName).name;
        storedMetadata[imageId] = {
          title: imageId,
          relativePath: baseName,
        };
      }
    }

    store.set('imageMetadata', storedMetadata);
    return { success: true };
  } catch (err) {
    console.error('Error uploading image:', err);
    return { success: false, error: err.message };
  }
});
