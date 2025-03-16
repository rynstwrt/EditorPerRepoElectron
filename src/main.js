const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require("electron/main");
const electronReload = require("electron-reload");
electronReload(__dirname, {ignored: /node_modules|[/\\]\.|epr-config\.json/});
const path = require("node:path");
const EPRConfig = require("./js/main/epr-config.js");
const { spawn } = require("child_process");


const APP_NAME = "EditorPerRepo";

const CONFIG_FILE = "epr-config.json";

const WINDOW_OPTIONS = {
    defaultView: "views/index.html",
    preloadFile: "js/preload.js",

    size: { width: 500, height: 200 },
    minSize: { minWidth: 300, minHeight: 150 },
    maxSize: { maxWidth: 2000, maxHeight: 1700 },

    behaviors: {
        show: false,
        resizable: false,
    },

    devTools: {
        openOnStart: true,
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
    // Create the main window
    window = new BrowserWindow({
        ...WINDOW_OPTIONS.size,
        ...WINDOW_OPTIONS.minSize,
        ...WINDOW_OPTIONS.maxSize,
        ...WINDOW_OPTIONS.behaviors,
        webPreferences: {
            preload: path.join(app.getAppPath(), WINDOW_OPTIONS.preloadFile)
        },
    });

    // Open devtools if devTools.openOnStart is enabled in WINDOW_OPTIONS
    if (WINDOW_OPTIONS.devTools.openOnStart)
        window.webContents.openDevTools({...WINDOW_OPTIONS.devTools.args});

    // Disable the menu bar
    window.removeMenu();

    // Load the HTML file and run post-load shenanigans
    window.loadFile(path.resolve(app.getAppPath(), WINDOW_OPTIONS.defaultView)).then(() => window.show());
}


async function openRepoWithEditor(editorPath, targetDir, firstTime=false)
{
    try
    {
        const proc = spawn(editorPath, [targetDir], {detached: true, stdio: ["ignore", "ignore", "ignore"]});
        proc.unref();

        if (firstTime)
            EPRConfig.addEditorAssignment(targetDir, editorPath);

        app.quit();
    }
    catch (err)
    {
        console.error(err);
    }
}


function createIPCListeners()
{
    // Listener for request to get editor list
    ipcMain.handle("request-editor-options", (_event) =>
    {
        return EPRConfig.getEditors();
    });


    // Open file select listener
    ipcMain.handle("dialog:openFile", async () =>
    {
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openFile"]});
        if (canceled)
            return;

        const editorPath = filePaths[0];
        const editorName = path.basename(editorPath);

        const addToConfigStatus = EPRConfig.addEditorToConfig(editorPath, editorName);
        if (addToConfigStatus && addToConfigStatus.error)
            return console.error(addToConfigStatus.error);

        return {path: editorPath, name: editorName};
    });


    // Remove editor listener
    ipcMain.on("remove-editor-from-config", async (_event, editorPath) =>
        EPRConfig.removeEditorFromConfig(editorPath));


    // Open repo with editor listener
    ipcMain.on("open-repo-with-editor", async (_event, editorPath) =>
        await openRepoWithEditor(editorPath, targetDir, true));
}


let targetDir;
function beforeWindowReady()
{
    const args = require('minimist')(process.argv.slice(2), { string: "target" });

    // Check if target dir was given
    const positionalArgs = args._;
    const targetOption = args.target;
    if (!positionalArgs.length && !targetOption)
    {
        console.error("Error: No target directory was given!");
        return app.quit();
    }

    // Check if target dir exists
    targetDir = targetOption || positionalArgs[positionalArgs.length - 1];
    if (!require("fs").existsSync(targetDir))
    {
        console.error(`Error: Given target directory does not exist!`);
        return app.quit();
    }

    // Set the app name
    app.setName(`${APP_NAME} - ${path.basename(targetDir)}`);
}


// Close the program when all windows are closed (except on Mac)
app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
        app.quit();
});


// Save config on quit
app.on("before-quit", async () =>
{
    await EPRConfig.saveConfig();
});


beforeWindowReady();
app.on("ready", async () =>
{
    // Set config path
    EPRConfig.configPath = path.resolve(app.getAppPath(), CONFIG_FILE);

    // Load user config
    EPRConfig.loadConfig().then(() =>
    {
        // Run editor if previously assigned
        const assignedEditor = EPRConfig.getAssignedEditor(targetDir);
        if (assignedEditor)
            return openRepoWithEditor(assignedEditor, targetDir);

        // Create window
        createWindow();

        // Create listeners for IPC events
        createIPCListeners();

        // Register developer tools keybind
        globalShortcut.register(
            WINDOW_OPTIONS.devTools.toggleKeybind,
            () => window.toggleDevTools());
    }).catch(console.error);


    // Create window when resuming after soft exit on Macs
    app.on("activate", () => !BrowserWindow.getAllWindows().length && createWindow());
});