module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        // osxSign: {},
        appCategoryType: "public.app-category.utilities",
        icon: "src/assets/icons/epr/epr.ico"
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