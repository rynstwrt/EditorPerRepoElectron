const { app, BrowserWindow, globalShortcut, ipcMain, dialog } = require("electron/main");
const electronReload = require("electron-reload");
electronReload(__dirname, {});
const path = require("node:path");
const EPRConfig = require("./js/main/epr-config.js");
const exec = require("child_process").exec;


const APP_NAME = "EditorPerRepo";

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
    // Create the main window
    window = new BrowserWindow({
        ...WINDOW_OPTIONS.size,
        ...WINDOW_OPTIONS.minSize,
        ...WINDOW_OPTIONS.maxSize,
        ...WINDOW_OPTIONS.args,
        webPreferences: {
            preload: path.join(__dirname, WINDOW_OPTIONS.preloadFile)
        },
    });

    // Disable the menu bar
    if (!WINDOW_OPTIONS.menu.enabled)
        window.removeMenu();

    // Open devtools if devTools.openOnStart is enabled in WINDOW_OPTIONS
    if (WINDOW_OPTIONS.devTools.openOnStart)
        window.webContents.openDevTools({...WINDOW_OPTIONS.devTools.args});

    // Load the HTML file and run post-load shenanigans
    window.loadFile(path.resolve(__dirname, WINDOW_OPTIONS.defaultView)).then(onWindowLoaded);
}


function openRepoWithEditor(editorPath, targetDir, firstTime=false)
{
    console.log("editorPath:", editorPath);
    console.log("targetDir:", targetDir);

    exec(`"${editorPath}" "${targetDir}"`, (err, stdout, stderr) =>
    {
        if (err)
            return console.error(`Error: There was an error opening the editor! ${err}`);

        if (firstTime)
            EPRConfig.addEditorAssignment(targetDir, editorPath);

        app.quit();
    });
}


function createIPCListeners()
{
    // Open file select listener
    ipcMain.handle("dialog:openFile", async () =>
    {
        const {canceled, filePaths} = await dialog.showOpenDialog({properties: ["openFile"]});
        if (canceled)
            return;

        const editorPath = filePaths[0];
        const editorName = path.basename(editorPath);

        const err = EPRConfig.addEditorToConfig(editorPath, editorName);
        if (err)
            return console.error(err);

        return {path: editorPath, name: editorName};
    });


    // Remove editor listener
    ipcMain.on("remove-editor-from-config", (_event, editorPath) =>
    {
        console.log("removing", editorPath);
        EPRConfig.removeEditorFromConfig(editorPath);
    });


    // Open repo with editor listener
    ipcMain.on("open-repo-with-editor", (_event, editorPath) =>
    {
        openRepoWithEditor(editorPath, targetDir, true);
    });
}


function onWindowLoaded()
{
    // Set the editor list from the config
    const editors = EPRConfig.getEditors();
    window.webContents.send("set-editor-options", editors);

    // Show the window
    window.show();
}


let targetDir;
function beforeWindowReady()
{
    const args = require('minimist')(process.argv.slice(2), { string: "target" });

    const positionalArgs = args._;
    const targetOption = args.target;
    if (!positionalArgs.length && !targetOption)
    {
        console.error("Error: No target directory was given!");
        return app.quit();
    }

    targetDir = targetOption || positionalArgs[positionalArgs.length - 1];
    console.log("target dir:", targetDir);
    if (!require("fs").existsSync(targetDir))
    {
        console.error(`Error: Given target directory does not exist!`);
        return app.quit();
    }

    // Set the app name
    app.setName(`${APP_NAME} - ${path.basename(targetDir)}`);
}


app.on("window-all-closed", () =>
{
    // Close the program when all windows are closed (except on Mac)
    if (process.platform !== "darwin")
        app.quit();
});


beforeWindowReady();
app.on("ready", async () =>
{
    // Load user config
    await EPRConfig.loadConfig();

    // Run editor if previously assigned
    const assignedEditor = EPRConfig.getAssignedEditor(targetDir);
    if (assignedEditor)
        return openRepoWithEditor(assignedEditor, targetDir);

    // Create window
    createWindow();

    // Create window when resuming after soft exit on Macs
    app.on("activate", () => !BrowserWindow.getAllWindows().length && createWindow());

    // Create listeners for IPC events
    createIPCListeners();

    // Register developer tools keybind
    globalShortcut.register(
        WINDOW_OPTIONS.devTools.toggleKeybind,
        () => window.toggleDevTools());
});