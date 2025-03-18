let isEditorSelectWindow;
window["eprAPI"].getTargetDir().then(targetDir =>
{
    isEditorSelectWindow = !!targetDir;

    document.title += " " + (targetDir ? `(${targetDir.split(/[\/\\]/).pop()})` : "- Remove" +
        " Editor Assignments");
});


let configData;
window["eprAPI"].requestConfigData().then(config =>
{
    configData = config;
});

