const { app, BrowserWindow, globalShortcut, ipcMain, dialog, Menu } = require("electron/main");
const electronReload = require("electron-reload");
electronReload(__dirname, {});
const path = require("node:path");
const { WINDOW_OPTIONS } = require("./js/main/constants.js");
const EPRConfig = require("./js/main/epr-config.js")


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

    window.loadFile(path.join(__dirname, "views/index.html"))
          .then(() => window.show());
}


app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
        app.quit();
});


// Open file select IPC listener
ipcMain.handle("dialog:openFile", async () =>
{
    const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openFile"]});
    if (canceled)
        return null;

    // TODO:
    // const filePath = path.resolve(filePaths[0]);
    // const fileName = path.basename(filePath);
    // EPRConfig.addEditor(filePaths[0], path.basename(filePaths[0]));
    // console.log(EPRConfig.getEditors());

    return {filePath: filePaths[0], fileName: path.basename(filePaths[0])};
});


// Open repo in editor IPC listener
ipcMain.on("open-repo-in-editor", (_event, data) =>
{
    // TODO: write
    console.log(data);
});


app.on("ready", () =>
{
    // Create window
    createWindow();

    // Create window when resuming after soft exit on Macs
    app.on("activate", !BrowserWindow.getAllWindows().length
                       ? createWindow
                       : () => {});

    // Register developer tools keybind
    globalShortcut.register(
        WINDOW_OPTIONS.devTools.toggleKeybind,
        () => window.toggleDevTools());
});