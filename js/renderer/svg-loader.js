const SVG_ICONS = {
    "remove": `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                         stroke="#2b2e36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="8" y1="12" x2="16" y2="12"></line></svg>`,

    "add": `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
                     stroke="#2b2e36" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line></svg>`
};


document.querySelectorAll(".svg-icon").forEach(iconPlaceholder =>
{
    const iconName = Array.from(iconPlaceholder.classList)
                          .reduce((acc, curr) => curr.startsWith("icon-")
                              && curr.replaceAll("icon-", ""));

    iconPlaceholder.outerHTML = SVG_ICONS[iconName] || null;
});

