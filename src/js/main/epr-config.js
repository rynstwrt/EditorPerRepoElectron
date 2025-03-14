const fs = require("fs");
const path = require("path")


const CONFIG_FILE = "../../epr-config.json";
// const REQUIRED_JSON_PROPERTIES = ["editors", "assignments"];
const DEFAULT_CONFIG_JSON = {editors: [], assignments: []};


class EPRConfig
{
    static #configPath = path.resolve(__dirname, CONFIG_FILE);
    static #editors = [];
    static #assignments = [];


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
                let jsonData = JSON.parse(fileContent);

                jsonData = Object.assign(DEFAULT_CONFIG_JSON, jsonData);

                // const missingProperties = Object.keys(DEFAULT_CONFIG_JSON).filter(x => !jsonData.hasOwnProperty(x));
                // if (missingProperties)
                // {
                //     console.log(`Config is missing required properties!`);
                //     console.log(`Setting [ ${missingProperties.join(" ")} ] to default`);
                //     missingProperties.forEach(prop => jsonData[prop] = DEFAULT_CONFIG_JSON[prop]);
                // }

                this.#editors = jsonData.editors;
                this.#assignments = jsonData.assignments;

                console.log(this.#editors, this.#assignments);
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