const path = require("path");


module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        appCategoryType: "public.app-category.utilities",
        icon: "assets/icons/epr/epr",
        ignore: [".idea"]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "EditorPerRepo",
                iconUrl: `file://${path.resolve(__dirname, "assets/icons/epr/epr.ico")}`,
                setupIcon: path.resolve(__dirname, "assets/icons/epr/epr.ico")
            }
        }
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "rynstwrt",
                    name: "EditorPerRepoElectron"
                },
                // draft: true,
                prerelease: true,
            }
        }
    ]
};