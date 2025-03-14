const editorSelectForm = document.querySelector("#editor-select-form");
const editorSelect = document.querySelector("#editor-select");
const addEditorButton = document.querySelector("#add-editor-button");


addEditorButton.addEventListener("click", async event =>
{
    event.preventDefault();
    const fileInfo = await window["eprAPI"].openFile();

    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(fileInfo.path);
    selectOption.textContent = fileInfo.name;
    // alert(selectOption.value.length, selectOption.textContent.length);
    // alert(selectOption.value, selectOption.textContent)

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
});


editorSelectForm.addEventListener("submit", event =>
{
    event.preventDefault();

    // %HOME%\Desktop\Atom_One_Dark.icls

    const selectedEditorPath = decodeURI(editorSelect.value);
    const selectedEditorName = editorSelect[editorSelect.selectedIndex].textContent;

    alert(selectedEditorName + " " + selectedEditorPath)

    window.eprAPI.openRepoInEditor({editorPath: selectedEditorPath, name: selectedEditorName});
}, false);
