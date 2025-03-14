const fs = require("fs");
const path = require("path")


const CONFIG_FILE = "../../epr-config.json";

const DEFAULT_CONFIG_JSON = {
    editors: [],  // [{path: "", name: ""}]
    assignments: []  // [{targetPath: "", editorPath: ""}]
};


class EPRConfig
{
    static #configPath = path.resolve(__dirname, CONFIG_FILE);
    static #config = DEFAULT_CONFIG_JSON;


    static #saveConfig()
    {
        fs.writeFile(this.#configPath, JSON.stringify(this.#config, null, 4), err =>
        {
            if (err)
                return console.log(`Error writing data to config!`, err);

            console.log("Successfully saved the config!");
        });
    }


    static async loadConfig()
    {
        return new Promise((res, rej) =>
        {
            fs.readFile(this.#configPath, "utf-8", (err, fileContent) =>
            {
                if (err)
                {
                    if (err.code !== "ENOENT")
                        return rej(err);

                    console.log("Config file does not exist! Creating...");
                    this.#saveConfig();
                }

                try
                {
                    const jsonData = JSON.parse(fileContent);
                    this.#config = Object.assign(DEFAULT_CONFIG_JSON, jsonData);
                    res();
                }
                catch (jsonErr)
                {
                    return rej(`Error parsing config JSON! Error: ${jsonErr}`);
                }
            });
        });
    }


    static getEditors()
    {
        return this.#config.editors;
    }


    static addEditorToConfig(editorPath, name)
    {
        const matchesInConfig = this.#config.editors.filter(editor => editor.path === editorPath);
        if (matchesInConfig.length)
            return console.error(`Error: Can't add editor path "${editorPath}" because it already exists!`);

        this.#config.editors.push({path: editorPath, name: name});
        this.#saveConfig();
    }


    static getEditorForDir(dir)
    {

    }
}


module.exports = EPRConfig;