module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        // osxSign: {},
        appCategoryType: "public.app-category.utilities",
        icon: "assets/icons/epr/epr",
        ignore: [".idea"]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "EditorPerRepo"
            }
        },
        // {
        //     name: '@electron-forge/maker-zip',
        //     platforms: ["darwin"]
        // }
    ]
};