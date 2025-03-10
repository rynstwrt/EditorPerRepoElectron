// window.eprGUI.onCreateAlert((alertMsg) =>
// {
//     alert(alertMsg);
//     window.eprGUI.afterCreateAlert("OOOOOOOOO");
// });

// window.eprGUI.printOnMainFromRenderer("test123").then(alert);


const editorSelect = document.querySelector("#editor-select");


function addEditor(fileInfo)
{
    const filePath = fileInfo.filePath;

    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(filePath);
    selectOption.textContent = fileInfo.fileName;

    editorSelect.insertBefore(selectOption, editorSelect.firstChild);
    editorSelect.value = selectOption.value;
}


const addEditorButton = document.querySelector("#add-editor-button");
addEditorButton.addEventListener("click", event =>
{
    event.preventDefault();
    window["eprAPI"].openFile().then(addEditor);
});


const allForms = document.querySelectorAll("form");
allForms.forEach(form => form.addEventListener("submit", event => event.preventDefault()));