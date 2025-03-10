const editorSelect = document.querySelector("#editor-select");


// function addEditor(fileInfo)
// {
//     const filePath = fileInfo.filePath;
//
//     const selectOption = document.createElement("option");
//     selectOption.value = encodeURI(filePath);
//     selectOption.textContent = fileInfo.fileName;
//
//     editorSelect.insertBefore(selectOption, editorSelect.firstChild);
//     editorSelect.value = selectOption.value;
// }


document.querySelector("#add-editor-button").addEventListener("click", async event =>
{
    event.preventDefault();
    const fileInfo = await window["eprAPI"].openFile();

    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(fileInfo.filePath);
    selectOption.textContent = fileInfo.fileName;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
});


// document.querySelector("#add-editor-button").addEventListener("click", event =>
// {
//     event.preventDefault();
//     window["eprAPI"].openFile().then(addEditor);
// });


const allForms = document.querySelectorAll("form");
allForms.forEach(form => form.addEventListener("submit", event => event.preventDefault()));