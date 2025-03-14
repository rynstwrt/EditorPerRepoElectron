const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require("electron/main");
const electronReload = require("electron-reload");
electronReload(__dirname, {});
const path = require("node:path");
const EPRConfig = require("./js/main/epr-config.js")


const APP_NAME = "EditorPerRepo";
app.setName(APP_NAME);


const WINDOW_OPTIONS = {
    defaultView: "views/index.html",
    preloadFile: "js/preload.js",

    size: { width: 500, height: 230 },
    minSize: { minWidth: 300, minHeight: 200 },
    maxSize: { maxWidth: 2000, maxHeight: 1700 },

    args: {
        show: false,
        resizable: true,
        frame: true,
        transparent: false,
        alwaysOnTop: false
    },

    menu: { enabled: false },

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
    window = new BrowserWindow({
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

    window.loadFile(path.resolve(__dirname, WINDOW_OPTIONS.defaultView))
          .then(() => window.show());
}


function createIPCListeners()
{
    // Open file select listener
    ipcMain.handle("dialog:openFile", async () =>
    {
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openFile"]});
        // return canceled ? null : {filePath: filePaths[0], fileName: path.basename(filePaths[0])};

        if (canceled)
            return;

        const editorInfo = {path: filePaths[0], name: path.basename(filePaths[0])};
        EPRConfig.addEditorToConfig(editorInfo.path, editorInfo.name);
        return editorInfo;
    });


    // Open repo in editor listener
    ipcMain.on("open-repo-in-editor", (_event, data) =>
    {
        console.log(data)
        // EPRConfig.addEditor(data.editorPath, data.name);
    });
}


app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
        app.quit();
});


app.on("ready", async () =>
{
    // Load user config
    await EPRConfig.loadConfig();

    // Create window
    createWindow();

    // Create window when resuming after soft exit on Macs
    app.on("activate", () => !BrowserWindow.getAllWindows().length && createWindow());

    // Send editors to renderer to make select options


    // Create listeners for IPC events
    createIPCListeners();

    // Register developer tools keybind
    globalShortcut.register(
        WINDOW_OPTIONS.devTools.toggleKeybind,
        () => window.toggleDevTools());

    setTimeout(() =>
    {
        const editors = EPRConfig.getEditors();
        window.webContents.send("set-editor-options", editors);
    }, 500);
});