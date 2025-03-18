const { app, BrowserWindow, globalShortcut, ipcMain, dialog, Notification, nativeImage} = require("electron");
const path = require("node:path");
const EPRConfig = require("./js/main/epr-config.js");
const { spawn } = require("child_process");
// (process.env.NODE_ENV === "development")
//     && require("electron-reload")(__dirname,
//     {ignored: /node_modules|[/\\]\.|epr-config\.json/, forceHardReset: true});


const APP_NAME = "EditorPerRepo";
const APP_ICON_PATH = "assets/icons/epr/epr.png";
const APP_ICON = nativeImage.createFromPath(APP_ICON_PATH);
const CONFIG_FILE = "epr-config.json";
const BYPASS_ASSIGNMENTS = true;

const REMOVE_ASSIGNMENTS_WINDOW_SIZE = { width: 700, height: 500 };

const WINDOW_OPTIONS = {
    defaultView: "views/index.html",
    preloadFile: "js/preload/preload.js",

    properties: {
        show: false,
        resizable: false,
        icon: APP_ICON,
        ...{ width: 500, height: 215 },
        ...{ minWidth: 300, minHeight: 150 },
        ...{ maxWidth: 2000, maxHeight: 1700 }
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
    // Create the main window
    window = new BrowserWindow({
        ...WINDOW_OPTIONS.properties,
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
    window.loadFile(path.resolve(app.getAppPath(), WINDOW_OPTIONS.defaultView));

    // Show the window when ready
    window.once("ready-to-show", window.show);
}


function createNotification(title, body, callback=() => {})
{
    const notification = new Notification({title: title, body: body, icon: APP_ICON});
    notification.on("click", callback);
    notification.show();
}


async function openRepoWithEditor(editorPath, targetDir, rememberSelection=false)
{
    try
    {
        const proc = spawn(editorPath, [targetDir], {detached: true, stdio: ["ignore", "ignore", "ignore"]});
        proc.unref();

        if (rememberSelection)
            EPRConfig.addEditorAssignment(targetDir, editorPath);

        await EPRConfig.saveConfig();
        app.quit();
    }
    catch (err)
    {
        console.error(err);
        createNotification(APP_NAME, "Failed to launch editor!", () => console.log("asdfasfasdf"));
    }
}


function createIPCListeners()
{
    // Listener for request to get editor list
    ipcMain.handle("request-config-data", (_event) =>
    {
        return Object.assign(EPRConfig.getConfigData(), { appName: APP_NAME, appIconPath: APP_ICON_PATH });
    });


    // Listener for getting target dir
    ipcMain.handle("get-target-dir", _event =>
    {
        return targetDir;
    });


    // Listener for selecting an editor
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


    // Listener for remove editor
    ipcMain.on("remove-editor-from-config", async (_event, editorPath) =>
        EPRConfig.removeEditorFromConfig(editorPath));


    // Listener for opening editor
    ipcMain.on("open-repo-with-editor", async (_event, editorPath, rememberChoice) =>
    {
        if (rememberChoice)
            EPRConfig.addEditorAssignment(targetDir, editorPath);

        EPRConfig.setStartWithRememberSelection(rememberChoice);
        console.log("set startWithRememberSelection to", rememberChoice)

        await openRepoWithEditor(editorPath, targetDir);
    });


    // Listener for remove assignments save button
    ipcMain.on("remove-assignment", async (_event, targetDir) =>
    {
        EPRConfig.removeAssignment(targetDir);
        await EPRConfig.saveConfig();
    });
}


let targetDir;
function beforeWindowReady()
{
    // Set the app name
    app.setName(APP_NAME);
    app.setAppUserModelId(APP_NAME);

    // Get target dir from arguments
    const runningFromExecutable = path.basename(app.getAppPath()) === "app.asar";
    const numIrrelevantArgs = runningFromExecutable ? 1 : 2;
    const args = require('minimist')(process.argv.slice(numIrrelevantArgs), { string: "target" });

    const positionalArgs = args._;
    const targetOption = args.target;

    // Check if target dir exists if given
    targetDir = targetOption || positionalArgs[positionalArgs.length - 1];
    if (targetDir && !require("fs").existsSync(targetDir))
    {
        console.error(`Error: Given target directory does not exist!`);
        return app.quit();
    }

    // Change size for remove assignments window
    if (!targetDir)
        Object.assign(WINDOW_OPTIONS.properties, REMOVE_ASSIGNMENTS_WINDOW_SIZE);
}


// Close the program when all windows are closed (except on Mac)
app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
        app.quit();
});


// // Save config on quit
// app.on("before-quit", async () =>
// {
//     // await EPRConfig.saveConfig();
// });


beforeWindowReady();
app.on("ready", async () =>
{
    // Set config path
    EPRConfig.configPath = path.join(app.getPath("appData"), APP_NAME, CONFIG_FILE);

    // Load user config
    EPRConfig.loadConfig().then(() =>
    {
        // Run editor if previously assigned
        const assignedEditor = EPRConfig.getAssignedEditor(targetDir);
        if (!BYPASS_ASSIGNMENTS && assignedEditor)
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