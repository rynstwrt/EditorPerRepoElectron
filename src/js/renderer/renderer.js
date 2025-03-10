const editorSelectForm = document.querySelector("#editor-select-form");
const editorSelect = document.querySelector("#editor-select");
const addEditorButton = document.querySelector("#add-editor-button");


editorSelectForm.addEventListener("submit", event =>
{
    event.preventDefault();


    // alert("A")
    // alert(editorSelect.options[editorSelect.selectedIndex].outerHTML);

    const selectedEditorPath = decodeURI(editorSelect.value).trim();
    const selectedEditorName = editorSelect.textContent.trim();



    // alert(selectedEditorName + " " + selectedEditorPath)
    // alert([encodeURI(selectedEditorPath), selectedEditorPath].join(" ").trim())

    // for (const [key, value] of formData)
    // {
    //     console.log(key, value);
    // }

    // console.log(formData.getAll());

    // event.preventDefault();
}, false);


addEditorButton.addEventListener("click", async event =>
{
    event.preventDefault();
    const fileInfo = await window["eprAPI"].openFile();

    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(fileInfo.filePath);
    selectOption.textContent = fileInfo.fileName;
    // alert(selectOption.value.length, selectOption.textContent.length);
    // alert(selectOption.value, selectOption.textContent)

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
});