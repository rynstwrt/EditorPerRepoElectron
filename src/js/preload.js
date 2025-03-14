/*
  [MAIN -> RENDERER]:
    1) MAIN: win.webContents.send("create-alert", <msgFromMain>);
    2) PRELOAD: onCreateAlert: cb => ipcRenderer.on("create-alert", (_event, value) => cb(value)),
    3) RENDERER: window.eprAPI.onCreateAlert((msgFromMain) => { ... });

  [RENDERER -> MAIN]:
    1) RENDERER: window.eprAPI.afterCreateAlert(<msgFromRenderer>);
    2) PRELOAD: afterCreateAlert: afterAlertMsg => ipcRenderer.send("after-create-alert", afterAlertMsg),
    3) MAIN: ipcMain.on("after-create-alert", (_event, msgFromRenderer) => { ... });

  [RENDERER -> MAIN -> RENDERER]:
    1) RENDERER: window.eprAPI.printOnMainFromRenderer(<msgFromRenderer>).then(msgFromMain => alert(msgFromMain));
    2) printOnMainFromRenderer: msg => ipcRenderer.invoke("print-on-main-from-renderer", msg),
    3) MAIN: ipcMain.handle("print-on-main-from-renderer", (_event, msgFromRenderer) => { ...return <msgFromMain> });
*/


const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("eprAPI", {
    openFile: () => ipcRenderer.invoke("dialog:openFile"),  // R🠚M🠚R

    onSetEditorOptions: cb => ipcRenderer.on("set-editor-options", (_event, value) => cb(value)),  // M🠚R

    openRepoInEditor: (editorInfo) => ipcRenderer.send("open-repo-in-editor", editorInfo)  // R🠚M
});