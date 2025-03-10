const path = require("node:path");


const WINDOW_OPTIONS = {
    defaultView: path.join(__dirname, "views/index.html"),
    preloadFile: "js/preload.js",

    size: { width: 500, height: 230 },
    minSize: { minWidth: 300, minHeight: 200 },
    maxSize: { maxWidth: 2000, maxHeight: 1700 },

    args: {
        show: false,
        resizable: true,
        frame: true,
        transparent: false,
        alwaysOnTop: false
    },

    menu: { enabled: true },

    devTools: {
        openOnStart: false,
        toggleKeybind: "Ctrl+Shift+I",
        args: {
            mode: "detach",
            activate: false,
            title: "EPR Dev Tools"
        }
    }
};


module.exports = {WINDOW_OPTIONS};