const { app, BrowserWindow } = require("electron");
const path = require("node:path");


const WINDOW_OPTIONS = {
    defaultView: "src/views/index.html",
    preloadFile: "js/preload.js",

    size: { width: 300, height: 400 },
    minSize: { minWidth: 100, minHeight: 100 },
    maxSize: { maxWidth: 600, maxHeight: 600 },


    args: {
        resizable: true,
        transparent: false,
        alwaysOnTop: false,
        webPreferences: {
            preload: null
        }
        // webPreferences: {
        //     preload: path.join(__dirname, this.preloadFile)
        // }
    }
};


const DEV_TOOLS_OPTIONS = {
    enabled: true,
    args: {
        mode: "detach",
        activate: false,
        title: "EPR Dev Tools"
    }
};


function createWindow()
{
    // const winConstructionOptions = {
    //     ...WINDOW_OPTIONS.size,
    //     ...WINDOW_OPTIONS.minSize,
    //     ...WINDOW_OPTIONS.maxSize,
    //     ...WINDOW_OPTIONS.args
    // };
    // winConstructionOptions.webPreferences.preload = path.join(__dirname, WINDOW_OPTIONS.preloadFile);


    // const newPart = {};
    // [WINDOW_OPTIONS.size, WINDOW_OPTIONS.minSize].forEach(o => Object.assign(newPart, o));
    // console.log(newPart)

    // // const browserWinOptions = { preload };
    // [WINDOW_OPTIONS.size,
    //     WINDOW_OPTIONS.minSize,
    //     WINDOW_OPTIONS.maxSize,
    //     WINDOW_OPTIONS.args]
    //     .forEach(o => Object.assign(browserWinOptions, o));
    //
    // console.log(browserWinOptions)

    const win = new BrowserWindow({
        [WINDOW_OPTIONS.size,
        WINDOW_OPTIONS.minSize,
        WINDOW_OPTIONS.maxSize,
        WINDOW_OPTIONS.args].forEach(o => Object.assign(this, o)),
        webPreferences: {
            preload: path.join(__dirname, WINDOW_OPTIONS.preloadFile)
        }
    });


    // const win = new BrowserWindow(browserWinOptions);

    // const win = new BrowserWindow({
    //     ...WINDOW_OPTIONS.size,
    //     ...WINDOW_OPTIONS.minSize,
    //     ...WINDOW_OPTIONS.maxSize,
    //     ...WINDOW_OPTIONS.args,
    //
    //     webPreferences: {
    //         preload: path.join(__dirname, WINDOW_OPTIONS.preloadFile)
    //     }
    // });

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