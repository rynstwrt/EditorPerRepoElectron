window.eprGUI.onCreateAlert((alertMsg) =>
{
    alert(alertMsg);
    window.eprGUI.afterCreateAlert("OOOOOOOOO");
});


window.eprGUI.printOnMainFromRenderer("test123").then(alert);

// const p = document.createElement("p");
// p.textContent = `${versions.getNode()} ${versions.getChrome()} ${versions.getElectron()}`;
// document.body.appendChild(p);