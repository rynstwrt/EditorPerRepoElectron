const editorSelect = document.querySelector("#editor-select");
const removeEditorButton = document.querySelector("#remove-editor-button");
const addEditorButton = document.querySelector("#add-editor-button");
const submitButton = document.querySelector("#editor-select-submit-button");


function createEditorSelectOption(path, name)
{
    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(path);
    selectOption.textContent = name;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
    submitButton.removeAttribute("disabled");
}


window["eprAPI"].requestEditorOptions().then(editors =>
{
    if (!editors.length)
        return submitButton.setAttribute("disabled", null);

    editors.forEach(({path, name}) => createEditorSelectOption(path, name));
});


removeEditorButton.addEventListener("click", async () =>
{
    const selectedEditorOption = editorSelect[editorSelect.selectedIndex];
    const selectedEditorPath = decodeURI(editorSelect.value);

    await window["eprAPI"].removeEditorFromConfig(selectedEditorPath);
    selectedEditorOption.remove();

    if (!editorSelect.value)
        submitButton.setAttribute("disabled", null);
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
    window["eprAPI"].openRepoWithEditor(selectedEditorPath);
});
