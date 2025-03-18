// const editorSelect = document.querySelector("#editor-select");
// const removeEditorButton = document.querySelector("#remove-editor-button");
// const addEditorButton = document.querySelector("#add-editor-button");
// const rememberChoiceCheckbox = document.querySelector("#remember-choice-checkbox");
// const editorSelectSubmitButton = document.querySelector("#editor-submit-button");
// const assignmentsSelect = document.querySelector("#assignments-select");
//
//
// function createEditorSelectOption(path, name)
// {
//     const selectOption = document.createElement("option");
//     selectOption.value = encodeURI(path);
//     selectOption.textContent = name;
//
//     editorSelect.insertBefore(selectOption, editorSelect.firstChild);
//     editorSelect.value = selectOption.value;
//
//     editorSelectSubmitButton.removeAttribute("disabled");
//     rememberChoiceCheckbox.parentElement.removeAttribute("disabled");
// }
//
//
// // function createAssignmentsSelectOption(assignment)
// // {
// //     const [targetDir, editorPath] = assignment;
// //     console.log(targetDir, editorPath);
// //
// //     const selectOption = document.createElement("option");
// //     selectOption.value = encodeURI(assignment["targetDir"]);
// //     selectOption.textContent = `${targetDir} -> ${editorPath}`;
// //
// //     assignmentsSelect.insertBefore(selectOption, assignmentsSelect.firstChild);
// // }
//
//
// // let isEditorSelectWindow;
// // window["eprAPI"].getTargetDir().then(targetDir =>
// // {
// //     isEditorSelectWindow = !!targetDir;
// //
// //     document.title += " " + (targetDir ? `(${targetDir.split(/[\/\\]/).pop()})` : "- Remove" +
// //         " Editor Assignments");
// //
// //     if (!targetDir)
// //         document.querySelectorAll("main").forEach(main => main.classList.toggle("disabled"));
// // });
//
// //
// // window["eprAPI"].requestConfigData().then(configData =>
// // {
// //     const editors = configData.editors;
// //
// //     if (isEditorSelectWindow)
// //     {
// //         if (!editors.length)
// //         {
// //             editorSelectSubmitButton.setAttribute("disabled", null);
// //             rememberChoiceCheckbox.parentElement.setAttribute("disabled", null);
// //         }
// //         else
// //         {
// //             editors.forEach(({path, name}) => createEditorSelectOption(path, name));
// //         }
// //
// //         rememberChoiceCheckbox["checked"] = configData.startWithRememberSelection;
// //     }
// //     // else
// //     // {
// //     //     const assignments = Object.entries(configData.assignments);
// //     //     assignments.forEach(createAssignmentsSelectOption);
// //     //
// //     //     createAssignmentsSelectOption([
// //     //         "C:\\Users\\ryans\\Dropbox\\OpenSCAD Projects\\8x8-LED-Matrix-Lamp",
// //     //         "C:\\Users\\ryans\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"
// //     //     ]);
// //     //
// //     //     createAssignmentsSelectOption([
// //     //         "asdf",
// //     //         "C:\\Users\\ryans\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"
// //     //     ]);
// //     // }
// // });
//
//
// removeEditorButton.addEventListener("click", async () =>
// {
//     const selectedEditorOption = editorSelect[editorSelect.selectedIndex];
//     const selectedEditorPath = decodeURI(editorSelect.value);
//
//     await window["eprAPI"].removeEditorFromConfig(selectedEditorPath);
//     selectedEditorOption.remove();
//
//     if (!editorSelect.value)
//     {
//         editorSelectSubmitButton.setAttribute("disabled", null);
//         rememberChoiceCheckbox.setAttribute("disabled", null);
//     }
// });
//
//
// addEditorButton.addEventListener("click", async () =>
// {
//     const fileInfo = await window["eprAPI"].openFile();
//     if (fileInfo)
//         createEditorSelectOption(fileInfo.path, fileInfo.name);
// });
//
//
// editorSelectSubmitButton.addEventListener("click", () =>
// {
//     if (!editorSelect.value)
//         return;
//
//     const selectedEditorPath = decodeURI(editorSelect.value);
//     window["eprAPI"].openRepoWithEditor(selectedEditorPath, rememberChoiceCheckbox["checked"]);
// });
//
//
// (() =>
// {
//     if (!isEditorSelectWindow)
//         return;
//
//     if (!configData.editors.length)
//     {
//         editorSelectSubmitButton.setAttribute("disabled", null);
//         rememberChoiceCheckbox.parentElement.setAttribute("disabled", null);
//     }
//     else
//     {
//         configData.editors.forEach(({path, name}) => createEditorSelectOption(path, name));
//     }
//
//     rememberChoiceCheckbox["checked"] = configData.startWithRememberSelection;
// })();
