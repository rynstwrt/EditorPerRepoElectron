const EDITOR_SELECT_SCRIPT_PATH = "../js/renderer/editor-select.js";
const REMOVE_ASSIGNMENTS_SCRIPT_PATH = "../js/renderer/remove-assignments.js";


const getBaseName = dirPath => dirPath.split(/[\/\\]/).pop();

let isEditorSelectWindow;
let configData;


(async () =>
{
    const targetDir = await window["eprAPI"].getTargetDir();
    isEditorSelectWindow = !!targetDir;

    document.title += " " + (targetDir ? `(${getBaseName(targetDir)})` : "- Remove" +
        " Editor Assignments");

    configData = await window["eprAPI"].requestConfigData();

    const script = document.createElement("script");
    script.src = isEditorSelectWindow ? EDITOR_SELECT_SCRIPT_PATH : REMOVE_ASSIGNMENTS_SCRIPT_PATH;
    script.defer = true;
    document.head.appendChild(script);
})();


// window["eprAPI"].createPopup("error", "main text", "details");