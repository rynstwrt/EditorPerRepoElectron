const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path")


const CONFIG_FILE = "../../epr-config.json";
// const REQUIRED_JSON_PROPERTIES = ["editors", "assignments"];
const DEFAULT_CONFIG_JSON = {editors: [], assignments: []};


class EPRConfig
{
    static #configPath = path.resolve(__dirname, CONFIG_FILE);

    static #config = null;

    // static #editors = [];
    // static #assignments = [];


    // static getEditors()
    // {
    //     return this.#editors;
    // }


    static #writeToConfig(data)
    {
        fs.writeFile(this.#configPath, JSON.stringify(data, null, 4), err =>
        {
            if (err)
                return console.log(`Error writing "${data}" to config!`, err);

            console.log("Successfully wrote to config!");
        });
    }


    static loadConfig()
    {
        fs.readFile(this.#configPath, "utf-8", (err, fileContent) =>
        {
            if (err)
            {
                if (err.code === "ENOENT")
                {
                    console.log("Config file does not exist! Creating...");
                    return this.#writeToConfig(DEFAULT_CONFIG_JSON);
                }

                return console.error(err);
            }

            try
            {
                const jsonData = JSON.parse(fileContent);
                this.#config = Object.assign(DEFAULT_CONFIG_JSON, jsonData);
            }
            catch (jsonErr)
            {
                console.log(`Error parsing config JSON! Error: ${jsonErr}`);
            }
        });
    }


    static addEditorToConfig(editorPath, name)
    {
        const entry = {path: editorPath, name: name};
        // this.#writeToConfig("")
    }


    static getEditorForDir(dir)
    {

    }
}


module.exports = EPRConfig;