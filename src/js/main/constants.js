const WINDOW_OPTIONS = {
    defaultView: "/views/index.html",
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

    menu: { enabled: false },

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


const CONFIG_FILE = "src/epr-config.json";


module.exports = {WINDOW_OPTIONS, CONFIG_FILE};