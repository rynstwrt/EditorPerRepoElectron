const detailsDiv = document.querySelector("#details");


// window["eprAPI"].getPopupInfo.then(info =>
window["eprAPI"].onSetPopupInfo(info =>
{
    const type = info.type;
    document.title = type.toUpperCase();

    document.querySelectorAll("#icon-container > svg")
            .forEach(icon => icon.style.display = "none");

    document.querySelector(`#${type}`).style.display = "block";

    document.querySelector("#main-text").textContent = info.mainText;

    info.details.forEach(detail =>
    {
        const p = document.createElement("p");
        p.textContent = detail;
        detailsDiv.appendChild(p);
    });
});


