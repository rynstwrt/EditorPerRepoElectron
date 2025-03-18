const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld("eprAPI", {
    onSetPopupInfo: cb => ipcRenderer.on("set-popup-info", (_event, info) => cb(info)),  // M🠚R

    // createPopup: (type, mainText, details) => ipcRenderer.send("create-popup", type, mainText, details)  // R🠚M
});


/*
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