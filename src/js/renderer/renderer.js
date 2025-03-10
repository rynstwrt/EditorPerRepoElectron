// window.eprGUI.onCreateAlert((alertMsg) =>
// {
//     alert(alertMsg);
//     window.eprGUI.afterCreateAlert("OOOOOOOOO");
// });

// window.eprGUI.printOnMainFromRenderer("test123").then(alert);



// function openFileFromMain(e)
// {
//     e.preventDefault();
//     window["eprGUI"].openFile().then(alert);
// }

const addEditorButton = document.querySelector("#add-editor-button");
// addEditorButton.addEventListener("click", openFileFromMain);

addEditorButton.addEventListener("click", event =>
{
    event.preventDefault();

    window["eprGUI"].openFile().then(alert);
});
