const { CONFIG_FILE } = require("./constants.js");
const fs = require("fs");
const path = require("path")


class EPRConfig
{
    static #editors = [];


    static getEditors()
    {
        return this.#editors;
    }


    static addEditor(editorPath, name)
    {
        const entry = {path: editorPath, name: name};
        fs.writeFile(path.resolve(CONFIG_FILE), JSON.stringify(entry), err =>
        {
            if (err)
                return console.log("Error writing to config!", err);

            console.log("Successfully wrote file!");
        });
    }
}


module.exports = EPRConfig;