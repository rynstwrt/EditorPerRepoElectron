const { app, BrowserWindow, globalShortcut, ipcMain, dialog, Menu } = require("electron/main");
const electronReload = require("electron-reload");
electronReload(__dirname, {});
const path = require("node:path");
const { WINDOW_OPTIONS } = require("./js/main/constants.js");
const EPRConfig = require("./js/main/epr-config.js")


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
    // Handle open file dialog invocation from renderer
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

    // DevTools keybind
    const devToolsToggleKeybind = WINDOW_OPTIONS.devTools.toggleKeybind;
    globalShortcut.register(devToolsToggleKeybind, () => window.toggleDevTools());
}


const isMac = process.platform === "darwin";
app.on("window-all-closed", () => !isMac && app.quit())

Menu.setApplicationMenu(null);

app.on("ready", () =>
{
    window = createWindow();

    const getNumWindows = () => BrowserWindow.getAllWindows().length;
    app.on('activate', () => !getNumWindows() && (window = createWindow()));

    registerEvents();
});


// const test =  () => setTimeout(() => console.log("hiii"), 1000);
const test = async () => setTimeout.bind(() => console.log("hiii"), 1000);
test.then(() => console.log("Bye"))

// app.whenReady().then(test).then(() => console.log("bye"));