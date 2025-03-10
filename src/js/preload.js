const { contextBridge, ipcRenderer } = require('electron')


/*
MAIN -> RENDERER:
    1) MAIN: win.webContents.send("create-alert", <msgFromMain>);
    2) RENDERER: window.eprAPI.onCreateAlert((msgFromMain) => { ... });

RENDERER -> MAIN:
    1) RENDERER: window.eprAPI.afterCreateAlert(<msgFromRenderer>);
    2) MAIN: ipcMain.on("after-create-alert", (_event, msgFromRenderer) => { ... });

RENDERER -> MAIN -> RENDERER:
    1) RENDERER: window.eprAPI.printOnMainFromRenderer(<msgFromRenderer>).then(msgFromMain => alert(msgFromMain));
    2) MAIN: ipcMain.handle("print-on-main-from-renderer", (_event, msgFromRenderer) => { ...return <msgFromMain>; });
*/


contextBridge.exposeInMainWorld("eprAPI", {
    openFile: () => ipcRenderer.invoke("dialog:openFile")  // R🠚M🠚R

    
    // onCreateAlert: callback => ipcRenderer.on("create-alert", (_event, value) => callback(value)),  // M🠚R

    // afterCreateAlert: afterAlertMsg => ipcRenderer.send("after-create-alert", afterAlertMsg),  // R🠚M

    // printOnMainFromRenderer: msg => ipcRenderer.invoke("print-on-main-from-renderer", msg)  // R🠚M🠚R
});