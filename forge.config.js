const path = require("path");


const PUBLISH_IS_DRAFT = true;
const PUBLISH_IS_PRERELEASE = true;

const REL_ICON_PATH = "assets/icons/epr/epr-icon.ico";


module.exports = {
    packagerConfig: {
        name: "EditorPerRepo",
        asar: true,
        appCategoryType: "public.app-category.utilities",
        icon: REL_ICON_PATH.replace(/\.ico$/, ""),
        ignore: [".idea", ".psd", "media/"]
        // ignore: [".idea", ".psd", "media/", "dist/", ".github/", "forge.config.js", "node_modules/", ".gitignore", ".gittributes", "package.json", "README.md"]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "EditorPerRepo",
                iconUrl: `file://${path.resolve(__dirname, REL_ICON_PATH)}`,
                setupIcon: path.resolve(__dirname, REL_ICON_PATH)

                // iconUrl: `file://${path.resolve(__dirname, "assets/icons/epr/epr-icon")}`,
                // setupIcon: path.resolve(__dirname, "assets/icons/epr/epr-icon")
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