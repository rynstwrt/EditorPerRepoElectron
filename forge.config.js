const path = require("path");


const PUBLISH_IS_DRAFT = true;
const PUBLISH_IS_PRERELEASE = true;


module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        appCategoryType: "public.app-category.utilities",
        icon: "assets/icons/epr/icon/epr-icon",
        ignore: [".idea", ".psd"]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "EditorPerRepo",
                iconUrl: `file://${path.resolve(__dirname, "assets/icons/epr/icon/epr-icon.ico")}`,
                setupIcon: path.resolve(__dirname, "assets/icons/epr/icon/epr-icon.ico")
                // skipUpdateIcon: true
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
                prerelease: PUBLISH_IS_PRERELEASE,
                draft: PUBLISH_IS_DRAFT
            }
        }
    ]
};