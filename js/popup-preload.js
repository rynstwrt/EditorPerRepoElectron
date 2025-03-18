const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("eprAPI", {
    onSetPopupInfo: cb => ipcRenderer.on("set-popup-info", (_event, info) => cb(info))  // M🠚R
});