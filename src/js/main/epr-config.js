const fs = require("fs");
const path = require("path")


// const CONFIG_FILE = "../../epr-config.json";

const DEFAULT_CONFIG_JSON = {
    editors: [],  // [{path: "", name: ""}]
    assignments: {}  // {targetDir: editorPath}
};


class EPRConfig
{
    // static configPath = path.resolve(__dirname, CONFIG_FILE);
    static configPath;
    static #config = DEFAULT_CONFIG_JSON;


    static async saveConfig()
    {
        try
        {
            await fs.promises.writeFile(this.configPath, JSON.stringify(this.#config, null, 4));
            console.log("Successfully wrote to config!");
        }
        catch (err)
        {
            console.error(err);
        }
    }


    static async loadConfig()
    {
        return new Promise((res, rej) =>
        {
            fs.readFile(this.configPath, "utf-8", async (err, fileContent) =>
            {
                if (err)
                {
                    if (err.code !== "ENOENT")
                        return rej(err);

                    console.log("Config file does not exist! Creating...");
                    await this.saveConfig();
                    return res();
                }

                try
                {
                    const jsonData = JSON.parse(fileContent);
                    this.#config = Object.assign(DEFAULT_CONFIG_JSON, jsonData);
                    res();
                }
                catch (jsonErr)
                {
                    rej(`Error parsing config JSON!\nError: ${jsonErr}`);
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
            return {error: `Error: Can't add editor path "${editorPath}" because it already exists!`};

        this.#config.editors.push({path: editorPath, name: name});
    }


    static removeEditorFromConfig(editorPath)
    {
        const matchesInConfig = this.#config.editors.filter(editor => editor.path === editorPath);
        if (!matchesInConfig.length)
            return `Error: Can't remove editor path "${editorPath}" because it's not in the config!`;

        const editorIndex = this.#config.editors.indexOf(matchesInConfig[0]);
        this.#config.editors.splice(editorIndex, 1);
    }


    static addEditorAssignment(targetDir, editorPath)
    {
        this.#config.assignments[targetDir] = editorPath.toString();
    }


    static getAssignedEditor(targetDir)
    {
        return this.#config.assignments[targetDir];
    }
}


module.exports = EPRConfig;