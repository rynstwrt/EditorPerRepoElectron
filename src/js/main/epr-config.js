const { Editor } = require("./editor.js");


class EPRConfig
{
    #editors = [];


    constructor()
    {
        const ed = new Editor("");
    }


    static getEditors()
    {
        return this.#editors;
    }


    static addEditor(editorPath, editorName)
    {

    }
}


module.exports = EPRConfig;