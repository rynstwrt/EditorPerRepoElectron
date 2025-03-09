const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("node:path");


const WINDOW_OPTIONS = {
    defaultView: "src/views/index.html",
    preloadFile: "js/preload.js",

    size: { width: 600, height: 300 },
    minSize: { minWidth: 300, minHeight: 200 },
    maxSize: { maxWidth: 2000, maxHeight: 1700 },

    args: {
        resizable: true,
        transparent: false,
        alwaysOnTop: false
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


let win;
function createWindow()
{
    win = new BrowserWindow({
        ...WINDOW_OPTIONS.size,
        ...WINDOW_OPTIONS.minSize,
        ...WINDOW_OPTIONS.maxSize,
        ...WINDOW_OPTIONS.args,
        webPreferences: {
            preload: path.join(__dirname, WINDOW_OPTIONS.preloadFile)
        }
    });

    if (WINDOW_OPTIONS.devTools.enabled)
        win.webContents.openDevTools(WINDOW_OPTIONS.devTools.args);

    win.removeMenu();

    (async () =>
    {
        const success = await win.loadFile(WINDOW_OPTIONS.defaultView).then(() => true).catch();
        console.log(`Default window view load ${success ? "success" : "FAIL"}!`);

        globalShortcut.register("Ctrl+Shift+I", () => win.webContents.toggleDevTools());
    })();
}


app.whenReady().then(() =>
{
    createWindow();
    app.on("activate", () =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});


app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
        app.quit();
});