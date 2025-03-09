const { app, BrowserWindow } = require("electron");
const path = require("node:path");


DEFAULT_WIN_SIZE = { width: 600, height: 400 };
DEFAULT_WIN_VIEW_PATH = "src/views/index.html";
PRELOAD_FILE = "js/preload.js"


function createWindow()
{
    const win = new BrowserWindow({
        width: DEFAULT_WIN_SIZE.width,
        height: DEFAULT_WIN_SIZE.height,
        webPreferences: {
            preload: path.join(__dirname, PRELOAD_FILE)
        }
    });

    win.removeMenu();
    // win.webContents.openDevTools();

    win.loadFile(DEFAULT_WIN_VIEW_PATH)
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