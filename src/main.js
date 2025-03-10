const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require("electron/main");
const electronReload = require("electron-reload");
electronReload(__dirname, {});
const path = require("node:path");
const EPRConfig = require("./js/main/epr-config.js")


const WINDOW_OPTIONS = {
    defaultView: path.join(__dirname, "views/index.html"),
    preloadFile: "js/preload.js",

    size: { width: 500, height: 230 },
    minSize: { minWidth: 300, minHeight: 200 },
    maxSize: { maxWidth: 2000, maxHeight: 1700 },

    args: {
        show: false,
        // resizable: false,
        // frame: false,
        // transparent: true,
        alwaysOnTop: false
    },

    menu: {
        enable: true
    },

    devTools: {
        enabled: false,
        args: {
            mode: "detach",
            activate: false,
            title: "EPR Dev Tools"
        }
    }
};


let window;
function createWindow()
{
    const window = new BrowserWindow({
        ...WINDOW_OPTIONS.size,
        ...WINDOW_OPTIONS.minSize,
        ...WINDOW_OPTIONS.maxSize,
        ...WINDOW_OPTIONS.args,
        webPreferences: {
            preload: path.join(__dirname, WINDOW_OPTIONS.preloadFile)
        },
    });

    window.removeMenu();

    if (WINDOW_OPTIONS.devTools.enabled)
        window.webContents.openDevTools({...WINDOW_OPTIONS.devTools.args});

    window.loadFile(WINDOW_OPTIONS.defaultView).then(() => window.show());
    return window;
}


function run()
{
    // const config = new EPRConfig();
    // config.getEditors();


    ipcMain.handle("dialog:openFile", async () =>
    {
        const { canceled, filePaths } = await dialog.showOpenDialog({properties: ["openFile"]});
        if (!canceled)
            return {filePath: filePaths[0], fileName: path.basename(filePaths[0])};
    });

    globalShortcut.register("Ctrl+Shift+I", () => window.webContents.toggleDevTools());


    window = createWindow();
    app.on("activate", () =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
            window = createWindow();
    });
}


app.whenReady().then(run);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });