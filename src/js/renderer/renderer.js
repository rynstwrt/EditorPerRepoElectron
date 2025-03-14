const editorSelect = document.querySelector("#editor-select");
const removeEditorButton = document.querySelector("#remove-editor-button");
const addEditorButton = document.querySelector("#add-editor-button");
const submitButton = document.querySelector("#editor-select-form-submit-button");


function createEditorSelectOption(path, name)
{
    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(path);
    selectOption.textContent = name;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
}


window["eprAPI"].onSetEditorOptions(editors =>
    editors.forEach(({path, name}) =>
        createEditorSelectOption(path, name)));


removeEditorButton.addEventListener("click", async () =>
{
    const selectedEditorOption = editorSelect[editorSelect.selectedIndex];
    const selectedEditorPath = decodeURI(editorSelect.value);

    await window["eprAPI"].removeEditorFromConfig(selectedEditorPath);
    selectedEditorOption.remove();
});


addEditorButton.addEventListener("click", async event =>
{
    event.preventDefault();

    const fileInfo = await window["eprAPI"].openFile();
    if (!fileInfo)
        return;

    createEditorSelectOption(fileInfo.path, fileInfo.name);
});


submitButton.addEventListener("click", () =>
{
    if (!editorSelect.value)
        return;

    const selectedEditorPath = decodeURI(editorSelect.value);
    window["eprAPI"].openRepoWithEditor(selectedEditorPath);
});
