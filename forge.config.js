const path = require("path");


const PUBLISH_IS_DRAFT = true;
const PUBLISH_IS_PRERELEASE = true;

const REL_ICON_PATH = "assets/icons/epr/icon/epr-icon.ico";


module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        appCategoryType: "public.app-category.utilities",
        icon: REL_ICON_PATH.replace(/\.ico$/, ""),
        ignore: [".idea", ".psd"]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "EditorPerRepo",
                iconUrl: `file://${path.resolve(__dirname, REL_ICON_PATH)}`,
                setupIcon: path.resolve(__dirname, REL_ICON_PATH)
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