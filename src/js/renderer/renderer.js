const editorSelectForm = document.querySelector("#editor-select-form");
const editorSelect = document.querySelector("#editor-select");
const addEditorButton = document.querySelector("#add-editor-button");


function createEditorSelectOption(path, name)
{
    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(path);
    selectOption.textContent = name;
    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
}


window.eprAPI.onSetEditorOptions(editors =>
{
    for (const {path, name} of editors)
    {
        const selectOption = document.createElement("option");
        selectOption.value = encodeURI(path);
        selectOption.textContent = name;
        editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    }
});


addEditorButton.addEventListener("click", async event =>
{
    event.preventDefault();
    const fileInfo = await window["eprAPI"].openFile();

    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(fileInfo.path);
    selectOption.textContent = fileInfo.name;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
});


editorSelectForm.addEventListener("submit", event =>
{
    event.preventDefault();

    // %HOME%\Desktop\Atom_One_Dark.icls

    if (!editorSelect.value)
        return;


    const selectedEditorPath = decodeURI(editorSelect.value);
    const selectedEditorName = editorSelect[editorSelect.selectedIndex].textContent;

    alert(selectedEditorName + " " + selectedEditorPath)

    window.eprAPI.openRepoInEditor({editorPath: selectedEditorPath, name: selectedEditorName});
}, false);
