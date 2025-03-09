const { contextBridge } = require('electron')


contextBridge.exposeInMainWorld('versions', {
    getNode: () => process.versions.node,
    getChrome: () => process.versions.chrome,
    getElectron: () => process.versions.electron
});