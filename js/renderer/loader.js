const EDITOR_SELECT_SCRIPTS = ["editor-select.js", "svg-loader.js"];
const REMOVE_ASSIGNMENTS_SCRIPTS = ["remove-assignments.js"];


const getBaseName = dirPath => dirPath.split(/[\/\\]/).pop();

let isEditorSelectWindow;
let configData;


function createScript(scriptName)
{
    const script = document.createElement("script");
    script.src = `../js/renderer/${scriptName}`;
    script.defer = true;
    document.head.appendChild(script);
}


(async () =>
{
    const targetDir = await window["eprAPI"].getTargetDir();
    isEditorSelectWindow = !!targetDir;

    document.title += " " + (targetDir ? `(${getBaseName(targetDir)})` : "- Remove Editor Assignments");

    configData = await window["eprAPI"].requestConfigData();

    (isEditorSelectWindow ? EDITOR_SELECT_SCRIPTS : REMOVE_ASSIGNMENTS_SCRIPTS).forEach(createScript);
})();


function createNotification(body="", callback=() => {})
{
    const notification = new window.Notification(configData.appName, {
        body: body,
        icon: `../${configData.appIconPath}`
    });

    notification.onclick = callback;
}