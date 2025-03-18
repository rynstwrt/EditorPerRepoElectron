const editorSelect = document.querySelector("#editor-select");
const removeEditorButton = document.querySelector("#remove-editor-button");
const addEditorButton = document.querySelector("#add-editor-button");
const rememberChoiceCheckbox = document.querySelector("#remember-choice-checkbox");
const editorSelectSubmitButton = document.querySelector("#editor-submit-button");


function createEditorSelectOption(path, name)
{
    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(path);
    selectOption.textContent = name;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;

    editorSelectSubmitButton.removeAttribute("disabled");
    rememberChoiceCheckbox.parentElement.removeAttribute("disabled");
}


removeEditorButton.addEventListener("click", async () =>
{
    const selectedEditorOption = editorSelect[editorSelect.selectedIndex];
    const selectedEditorPath = decodeURI(editorSelect.value);

    await window["eprAPI"].removeEditorFromConfig(selectedEditorPath);
    selectedEditorOption.remove();

    if (!editorSelect.value)
    {
        editorSelectSubmitButton.setAttribute("disabled", null);
        rememberChoiceCheckbox.setAttribute("disabled", null);
    }
});


addEditorButton.addEventListener("click", async () =>
{
    const fileInfo = await window["eprAPI"].openFile();
    if (fileInfo)
        createEditorSelectOption(fileInfo.path, fileInfo.name);
});


editorSelectSubmitButton.addEventListener("click", () =>
{
    // if (editorSelect.value)
    // {
    //     // document.querySelector("webview").loadURL("https://google.com")
    //     // const pw = window.open("", "modal");
    //     // console.log(pw);
    //     // pw.show();
    // }

    // alert(window.location);
    // window.open('file://C:\\Users\\ryans\\Documents\\GitHub\\EditorPerRepoElectron\\views\\popup.html', '_blank', 'top=500,left=200');
    // const w = window.open("", "modal");
    // w.loadFile("popup.html");
    new window.Notification("title", { body: "body" })
    return;

    if (!editorSelect.value)
        return;

    const selectedEditorPath = decodeURI(editorSelect.value);
    window["eprAPI"].openRepoWithEditor(selectedEditorPath, rememberChoiceCheckbox["checked"]);
});


(() =>
{
    if (!configData.editors.length)
    {
        editorSelectSubmitButton.setAttribute("disabled", null);
        rememberChoiceCheckbox.parentElement.setAttribute("disabled", null);
    }
    else
    {
        configData.editors.forEach(({path, name}) => createEditorSelectOption(path, name));
    }

    rememberChoiceCheckbox["checked"] = configData.startWithRememberSelection;
})();
