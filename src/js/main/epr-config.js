const { Editor } = require("./editor.js");


class EPRConfig
{
    static #editors = [];


    constructor()
    {

    }


    static getEditors()
    {
        return this.#editors;
    }


    static addEditor(path, name)
    {
        const editorEntry = new Editor(path, name);
        this.#editors.push(editorEntry);
    }
}


module.exports = EPRConfig;