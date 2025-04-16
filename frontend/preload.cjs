const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadImages: () => ipcRenderer.invoke('load-images'),
  deleteImage: (imageId) => ipcRenderer.invoke('delete-image', imageId),
  editImage: (inputPath, options) => ipcRenderer.invoke('edit-image', inputPath, options),
  getAlbums: () => ipcRenderer.invoke('get-albums'),
  addImageToAlbum: (data) => ipcRenderer.invoke('add-image-to-album', data),
  uploadImage: (filePaths) => ipcRenderer.invoke('upload-image', filePaths),
  getImagePathForEditor: (imageId) => ipcRenderer.invoke('get-image-path', imageId),
  saveEditedImage: (data) => ipcRenderer.invoke('save-edited-image', data),
});

console.log('Preload script loaded.');
