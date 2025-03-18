const editorSelect = document.querySelector("#editor-select");
const removeEditorButton = document.querySelector("#remove-editor-button");
const addEditorButton = document.querySelector("#add-editor-button");
const rememberChoiceCheckbox = document.querySelector("#remember-choice-checkbox");
const submitButton = document.querySelector("#editor-submit-button");


function createEditorSelectOption(path, name)
{
    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(path);
    selectOption.textContent = name;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;

    submitButton.removeAttribute("disabled");
    rememberChoiceCheckbox.parentElement.removeAttribute("disabled");
}


window["eprAPI"].getTargetDir().then(targetDirName =>
{
    document.title += " " + (targetDirName ? `(${targetDirName})` : "Configuration");
});


window["eprAPI"].requestConfigData().then(configData =>
{
    const editors = configData.editors;
    if (!editors.length)
    {
        submitButton.setAttribute("disabled", null);
        rememberChoiceCheckbox.parentElement.setAttribute("disabled", null);
    }
    else
    {
        editors.forEach(({path, name}) => createEditorSelectOption(path, name));
    }

    rememberChoiceCheckbox["checked"] = configData.startWithRememberSelection;
});


removeEditorButton.addEventListener("click", async () =>
{
    const selectedEditorOption = editorSelect[editorSelect.selectedIndex];
    const selectedEditorPath = decodeURI(editorSelect.value);

    await window["eprAPI"].removeEditorFromConfig(selectedEditorPath);
    selectedEditorOption.remove();

    if (!editorSelect.value)
    {
        submitButton.setAttribute("disabled", null);
        rememberChoiceCheckbox.setAttribute("disabled", null);
    }
});


addEditorButton.addEventListener("click", async () =>
{
    const fileInfo = await window["eprAPI"].openFile();
    if (fileInfo)
        createEditorSelectOption(fileInfo.path, fileInfo.name);
});


submitButton.addEventListener("click", () =>
{
    if (!editorSelect.value)
        return;

    const selectedEditorPath = decodeURI(editorSelect.value);
    window["eprAPI"].openRepoWithEditor(selectedEditorPath, rememberChoiceCheckbox["checked"]);
});
