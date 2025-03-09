const { contextBridge, ipcRenderer } = require('electron')


// MAIN -> RENDERER:
    // 1) MAIN: win.webContents.send("create-alert", <msgFromMain>);
    // 2) RENDERER: window.eprGUI.onCreateAlert((msgFromMain) => { ... });


// RENDERER -> MAIN:
    // 1) RENDERER: window.eprGUI.afterCreateAlert(<msgFromRenderer>);
    // 2) MAIN: ipcMain.on("after-create-alert", (_event, msgFromRenderer) => { ... });


// RENDERER -> MAIN -> RENDERER:
    // 1) RENDERER: window.eprGUI.printOnMainFromRenderer(<msgFromRenderer>).then(msgFromMain => alert(msgFromMain));
    // 2) MAIN: ipcMain.handle("print-on-main-from-renderer", (_event, msgFromRenderer) => { ...return <msgFromMain>; });

contextBridge.exposeInMainWorld("eprGUI", {
    // [MAIN -> RENDERER]
    onCreateAlert: callback => ipcRenderer.on("create-alert", (_event, value) => callback(value)),


    // [RENDERER -> MAIN]
    afterCreateAlert: afterAlertMsg => ipcRenderer.send("after-create-alert", afterAlertMsg),


    // [RENDERER -> MAIN -> RENDERER]
    printOnMainFromRenderer: msg => ipcRenderer.invoke("print-on-main-from-renderer", msg),
});



// // STOCK EXAMPLE:
// contextBridge.exposeInMainWorld('versions', {
//     getNode: () => process.versions.node,
//     getChrome: () => process.versions.chrome,
//     getElectron: () => process.versions.electron
// });
