// src/main/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    databaseQuery: (query, params) => ipcRenderer.invoke('database-query', query, params),
});