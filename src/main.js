const { app, BrowserWindow } = require("electron");
const path = require("node:path");


WINDOW_OPTIONS = {
    size: { width: 600, height: 400 },
    defaultView: "src/views/index.html",
    resizable: true,
    transparent: false,
    alwaysOnTop: false
};

DEV_TOOLS_OPTIONS = {
    enabled: true,
    args: {
        mode: "detach",
        activate: false,
        title: "EPR Dev Tools"
    }
};

PRELOAD_FILE = "js/preload.js"


function createWindow()
{
    const win = new BrowserWindow({
        width: WINDOW_OPTIONS.size.width,
        height: WINDOW_OPTIONS.size.height,

        resizable: WINDOW_OPTIONS.resizable || true,
        transparent: WINDOW_OPTIONS.transparent,
        alwaysOnTop: WINDOW_OPTIONS.alwaysOnTop,

        webPreferences: {
            preload: path.join(__dirname, PRELOAD_FILE)
        }
    });

    win.removeMenu();

    if (DEV_TOOLS_OPTIONS.enabled)
        win.webContents.openDevTools(DEV_TOOLS_OPTIONS.args);

    win.loadFile(WINDOW_OPTIONS.defaultView)
       .then(() => console.log(`Default window view load success!`))
       .catch(() => console.log(`Default window view load FAIL!`));
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