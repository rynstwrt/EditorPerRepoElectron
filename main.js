const { app, BrowserWindow, globalShortcut, ipcMain, dialog} = require("electron/main");
const path = require("node:path");
const EPRConfig = require("./js/main/epr-config.js");
const { spawn } = require("child_process");
(process.env.NODE_ENV === "development")
    && require("electron-reload")(__dirname,
    {ignored: /node_modules|[/\\]\.|epr-config\.json/});


const APP_NAME = "EditorPerRepo";

const CONFIG_FILE = "epr-config.json";
const BYPASS_ASSIGNMENTS = true;

const REMOVE_ASSIGNMENTS_WINDOW_SIZE = { width: 700, height: 500 };

const WINDOW_OPTIONS = {
    defaultView: "views/index.html",
    preloadFile: "js/preload.js",
    icon: "assets/icons/epr/epr",

    size: { width: 500, height: 215 },
    minSize: { minWidth: 300, minHeight: 150 },
    maxSize: { maxWidth: 2000, maxHeight: 1700 },

    behaviors: {
        show: false,
        resizable: false,
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

const POPUP_WINDOW_OPTIONS = {
    defaultView: "views/popup.html",
    preloadFile: "js/popup-preload.js",
    icon: "assets/icons/epr/epr",
    size: { width: 500, height: 215 },

    behaviors: {
        show: false,
        resizable: false
    }
};


let window;
function createWindow()
{
    // Create the main window
    window = new BrowserWindow({
        icon: WINDOW_OPTIONS.icon,
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
    window.loadFile(path.resolve(app.getAppPath(), WINDOW_OPTIONS.defaultView));

    // Show the window when ready
    window.once("ready-to-show", window.show);
}


function createPopup(title="Info")
{
    const popupWindow = new BrowserWindow({
        parent: window,
        icon: WINDOW_OPTIONS.icon,
        ...POPUP_WINDOW_OPTIONS.size,
        ...POPUP_WINDOW_OPTIONS.behaviors,
        webPreferences: {
            preload: path.join(app.getAppPath(), POPUP_WINDOW_OPTIONS.preloadFile)
        },
    });

    popupWindow.removeMenu();
    popupWindow.setAlwaysOnTop(true, "pop-up-menu");

    // popupWindow.setPosition(0, 0);
    popupWindow.setTitle(title)

    popupWindow.loadFile(path.resolve(app.getAppPath(), POPUP_WINDOW_OPTIONS.defaultView))

    const popupInfo = {test: 123};
    popupWindow.once("ready-to-show", () =>
    {
        popupWindow.webContents.send("set-popup-info", popupInfo);
        popupWindow.show();
    });
}


async function openRepoWithEditor(editorPath, targetDir, rememberSelection=false)
{
    try
    {
        const proc = spawn(editorPath, [targetDir], {detached: true, stdio: ["ignore", "ignore", "ignore"]});
        proc.unref();

        if (rememberSelection)
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
    ipcMain.handle("request-config-data", (_event) =>
    {
        return EPRConfig.getConfigData();
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


    // Listener for remove assignment
    ipcMain.on("remove-assignment", async (_event, targetDir) =>
    {
        // const w = new BrowserWindow({ parent: window, show: false });
        // w.loadFile(path.resolve(app.getAppPath(), "views/popup.html"))
        // // w.setPosition(0, 0);
        // w.once("ready-to-show", w.show);

        // dialog.showMessageBoxSync(window, {message: "message", type: "warning", title: "title",
        //     detail: "more details"});
        // app.exit(0);
        // return;

        EPRConfig.removeAssignment(targetDir);
        await EPRConfig.saveConfig();
    });
}


let targetDir;
function beforeWindowReady()
{
    // Set the app name
    app.setName(APP_NAME);

    // Get target dir from arguments
    const args = require('minimist')(process.argv.slice(2), { string: "target" });
    const positionalArgs = args._;
    const targetOption = args.target;

    // Check if target dir exists if given
    targetDir = targetOption || positionalArgs[positionalArgs.length - 1];
    if (targetDir && !require("fs").existsSync(targetDir))
    {
        console.error(`Error: Given target directory does not exist!`);
        return app.quit();
    }

    if (!targetDir)
        WINDOW_OPTIONS.size = REMOVE_ASSIGNMENTS_WINDOW_SIZE;
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

        createPopup();
        // window.once("ready-to-show", createPopup);
    }).catch(console.error);

    // Create window when resuming after soft exit on Macs
    app.on("activate", () => !BrowserWindow.getAllWindows().length && createWindow());
});