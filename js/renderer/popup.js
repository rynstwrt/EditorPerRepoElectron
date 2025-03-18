// const POPUP_TYPE_TITLE_SUFFIXES = {
//     "info": "Info",
//     "warning": "Warning"
// };

const detailsDiv = document.querySelector("#details");


window["eprAPI"].onSetPopupInfo(info =>
{
    const type = info.type;
    
    // const typeText = type.charAt(0).toUpperCase() + type.slice(1);
    // const title = `EditorPerRepo - ${typeText}`;
    // document.title = title;

    document.title = type.toUpperCase();
    document.querySelector("#main-text").textContent = info.mainText;
    info.details.forEach(detail =>
    {
        const p = document.createElement("p");
        p.textContent = detail;
        detailsDiv.appendChild(p);
    });
});