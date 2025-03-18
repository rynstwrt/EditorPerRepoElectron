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
    2) PRELOAD: printOnMainFromRenderer: msg =>
     ipcRenderer.invoke("print-on-main-from-renderer", msg),
    3) MAIN: ipcMain.handle("print-on-main-from-renderer", (_event, msgFromRenderer) => { ...return <msgFromMain> });
*/


const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("eprAPI", {
    removeEditorFromConfig: (editorPath) => ipcRenderer.send("remove-editor-from-config", editorPath),  // R🠚M

    openRepoWithEditor: (editorPath, rememberChoice) => ipcRenderer.send("open-repo-with-editor", editorPath, rememberChoice),  // R🠚M

    openFile: () => ipcRenderer.invoke("dialog:openFile"),  // R🠚M🠚R

    requestConfigData: () => ipcRenderer.invoke("request-config-data"),  // R🠚M🠚R

    getTargetDir: () => ipcRenderer.invoke("get-target-dir")  // R🠚M🠚R
});