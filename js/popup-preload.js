const { contextBridge, ipcRenderer } = require('electron');

/*
    1) MAIN: win.webContents.send("create-alert", <msgFromMain>);
    2) PRELOAD: onCreateAlert: cb => ipcRenderer.on("create-alert", (_event, value) => cb(value)),
    3) RENDERER: window.eprAPI.onCreateAlert((msgFromMain) => { ... });
 */

contextBridge.exposeInMainWorld("eprAPI", {
    onSetPopupInfo: cb => ipcRenderer.on("set-popup-info", (_event, info) => cb(info))

    // removeEditorFromConfig: (editorPath) => ipcRenderer.send("remove-editor-from-config", editorPath),  // R🠚M
    //
    // openRepoWithEditor: (editorPath, rememberChoice) => ipcRenderer.send("open-repo-with-editor", editorPath, rememberChoice),  // R🠚M
    //
    // removeAssignment: (targetDir) => ipcRenderer.send("remove-assignment", targetDir),  // R🠚M
    //
    // openFile: () => ipcRenderer.invoke("dialog:openFile"),  // R🠚M🠚R
    //
    // requestConfigData: () => ipcRenderer.invoke("request-config-data"),  // R🠚M🠚R
    //
    // getTargetDir: () => ipcRenderer.invoke("get-target-dir")  // R🠚M🠚R
});