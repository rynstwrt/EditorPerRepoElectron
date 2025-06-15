const fs = require("fs");
const path = require("path");
require("@dotenvx/dotenvx").config();


const DEFAULT_CONFIG_JSON = {
    editors: [],  // [{path: "", name: ""}]
    assignments: {},  // {targetDir: editorPath}
    startWithRememberSelection: true
};


class EPRConfig
{
    static configPath;
    static #config = DEFAULT_CONFIG_JSON;


    static async saveConfig()
    {
        if (!this.configPath)
            return console.error("Config's configPath is not defined!");

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


    static getConfigData()
    {
        return this.#config;
    }


    // TODO: Allow paths with glob patterns
    //     e.g. "C:\Program Files\JetBrains\IntelliJ IDEA*\bin\idea64.exe"
    static addEditorToConfig(editorPath, name)
    {
        console.log(editorPath,  name);

        if (this.#config.editors.some(editor => editor.path === editorPath))
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


    // TODO: Allow targetDir with glob patterns
    //     e.g. "C:\Program Files\JetBrains\IntelliJ IDEA*\bin\idea64.exe"
    //  (RETURN GLOB STATEMENT EVAL RESULT EDITOR PATH STRING)
    static getAssignedEditor(targetDir)
    {
        // console.log(process.env.HOME, process.env.)

        console.log("\n", "=================\n");
        // const assignedEditorPath = this.#config.assignments[targetDir];
        let assignedEditorPath = this.#config.assignments[targetDir];
        console.log(assignedEditorPath);


        // const editorPathEnvVarNames = assignedEditorPath.toString().matchAll(/%([\w_]+)%/g);
        // for (const envVar of editorPathEnvVarNames)
        // {
        //     const envVarName = envVar[1];
        //     const envVarValue = process.env[envVarName];
        //     console.log(envVarName, envVarValue)
        //     assignedEditorPath = assignedEditorPath.toString().replaceAll(/)
        // }

        // const assignedEditorEnvParsedPath = assignedEditorPath.toString().replaceAll(/%([\w_]+)%/g, q => q.toLocaleLowerCase());
        // const assignedEditorEnvParsedPath = "%PROGRAMFILES%\\Microsoft\\Visual Studio Code\\Code.exe"
        const assignedEditorEnvParsedPath = assignedEditorPath.replaceAll(/%[\w_]+%/g, envVarName => {
                envVarName = envVarName.replaceAll("%", "");
                console.log(envVarName);
                console.log()

                return process.env[envVarName];
            });
        console.log(assignedEditorEnvParsedPath);
        return assignedEditorEnvParsedPath;

        // const p = assignedEditorPath.toString().replaceAll(/%([\w_]+)%/g, "^");
        // console.log(p);

        // const p = path.parse(assignedEditorPath);
        // console.log(p);
        //
        // const d = path.resolve(assignedEditorPath);
        // console.log("d:", d);

        // return assignedEditorPath;
        // return this.#config.assignments[targetDir];
    }


    static setStartWithRememberSelection(rememberChoiceSelected)
    {
        this.#config.startWithRememberSelection = rememberChoiceSelected;
    }


    static removeAssignment(targetDir)
    {
        delete this.#config.assignments[targetDir];
    }
}


module.exports = EPRConfig;