const p = document.createElement("p");
p.textContent = `${versions.getNode()} ${versions.getChrome()} ${versions.getElectron()}`;
document.body.appendChild(p);