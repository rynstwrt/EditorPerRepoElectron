const { app, BrowserWindow, globalShortcut, ipcMain, dialog, Menu } = require("electron/main");
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
        enabled: true
    },

    devTools: {
        openOnStart: false,
        toggleKeybind: "Ctrl+Shift+I",
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

    if (!WINDOW_OPTIONS.menu.enabled)
        window.removeMenu();

    if (WINDOW_OPTIONS.devTools.openOnStart)
        window.webContents.openDevTools({...WINDOW_OPTIONS.devTools.args});

    window.loadFile(WINDOW_OPTIONS.defaultView).then(() => window.show());
    return window;
}


function registerEvents()
{
    ipcMain.handle("dialog:openFile", async () =>
    {
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openFile"]});
        if (canceled)
            return null;

        const filePath = path.resolve(filePaths[0]);
        const fileName = path.basename(filePath);

        // TODO:
        EPRConfig.addEditor(filePaths[0], path.basename(filePaths[0]));
        console.log(EPRConfig.getEditors());

        return {
            filePath: filePaths[0],
            fileName: path.basename(filePaths[0])
        };
    });

    // DevTools keybind
    const devToolsToggleKeybind = WINDOW_OPTIONS.devTools.toggleKeybind;
    globalShortcut.register(devToolsToggleKeybind, () => window.toggleDevTools());
}


function run()
{
    window = createWindow();

    app.on("activate", () =>
    {
        if (!BrowserWindow.getAllWindows().length)
            window = createWindow();
    });

    registerEvents();
}


app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
        app.quit();
});

Menu.setApplicationMenu(null);
app.on("ready", run);

// app.whenReady().then(run);
// app.whenReady().then(run).then(registerEvents);