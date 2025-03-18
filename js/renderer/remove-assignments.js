const removeAssignmentsSelect = document.querySelector("#remove-assignments-select");
const removeSelectedAssignmentsButton = document.querySelector("#remove-selected-assignments-button");
const removeAssignmentsSaveButton = document.querySelector("#remove-assignments-save-button");


function createAssignmentsSelectOption(assignment)
{
    const [targetDir, editorPath] = assignment;
    console.log(targetDir, editorPath);

    const selectOption = document.createElement("option");
    selectOption.value = encodeURI(assignment["targetDir"]);
    // selectOption.textContent = `${targetDir} -> ${getBaseName(editorPath)}`;
    selectOption.textContent = `${targetDir} (${getBaseName(editorPath)})`;

    removeAssignmentsSelect.insertBefore(selectOption, removeAssignmentsSelect.firstChild);
}


removeSelectedAssignmentsButton.addEventListener("click", () =>
{
    console.log("remove selected");
    console.log()
});


removeAssignmentsSaveButton.addEventListener("click", () =>
{
    console.log("save");
});


(() =>
{
    if (isEditorSelectWindow)
        return;


    document.querySelectorAll("main").forEach(main => main.classList.toggle("disabled"));


    const assignments = Object.entries(configData.assignments);
    assignments.forEach(createAssignmentsSelectOption);

    createAssignmentsSelectOption([
        "C:\\Users\\ryans\\Dropbox\\OpenSCAD Projects\\8x8-LED-Matrix-Lamp",
        "C:\\Users\\ryans\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"
    ]);

    createAssignmentsSelectOption([
        "asdf",
        "C:\\Users\\ryans\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"
    ]);
})();