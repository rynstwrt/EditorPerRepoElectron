const path = require("path");


console.log("\n\n", path.resolve(__dirname, "assets/icons/epr/icon/epr-icon.png"), "\n\n\n");


module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        appCategoryType: "public.app-category.utilities",
        icon: "assets/icons/epr/icon/epr-icon",
        ignore: [".idea"]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "EditorPerRepo",
                iconUrl: `file://${path.resolve(__dirname, "assets/icons/epr/icon/epr-icon.ico")}`,

                // setupIcon: path.resolve(__dirname, "assets/icons/epr/epr.ico")
                setupIcon: path.resolve(__dirname, "assets/epr-icon.ico"),
                skipUpdateIcon: true
                // setupIcon: "C:\\Users\\ryans\\Documents\\GitHub\\EditorPerRepoElectron\\assets\\icons\\epr\\icon\\epr-icon.ico"
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