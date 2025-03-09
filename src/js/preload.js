const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('versions', {
    getNode: () => process.versions.node,
    getChrome: () => process.versions.chrome,
    getElectron: () => process.versions.electron
});


contextBridge.exposeInMainWorld("eprGUI", {
    // MAIN -> RENDERER //
    onCreateAlert: callback => ipcRenderer.on("create-alert", (_event, value) => callback(value)),


    // RENDERER -> MAIN (ONE-WAY) //
    afterCreateAlert: afterAlertMsg => ipcRenderer.send("after-create-alert", afterAlertMsg),


    // RENDERER -> MAIN (TWO-WAYS) //
    printOnMainFromRenderer: msg => ipcRenderer.invoke("print-on-main-from-renderer", msg),
});