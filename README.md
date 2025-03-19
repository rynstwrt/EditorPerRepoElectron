<div width="100%" align="center">
<img alt="EPR Icon" height="220" src="media/epr-icon.png"/>
<h1>EditorPerRepo (WIP) 📦</h1>

<h3>Open a different editor for each repo when using<br>GitHub Desktop's editor integration feature!</h3>


.𖥔 ݁ ˖ ✦ ‧₊˚ ⋅

![Made with love badge](https://img.shields.io/badge/MADE%20WITH%20LOVE-%23f765af?style=plastic&logo=githubsponsors&logoColor=%23FFF)&nbsp;&nbsp;
![Created by Ryn badge](https://img.shields.io/badge/CREATED%20BY%20RYN!!!-%23FF6600?style=for-the-badge&logo=apachespark&logoColor=%23FFF)&nbsp;&nbsp;
![Swagalicious badge](https://img.shields.io/badge/SWAGALICIOUS-%2328b3b5?style=plastic&logo=zcool&logoColor=%23FFF)

![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/rynstwrt/EditorPerRepoElectron/total?style=for-the-badge&color=%2328b3b5)&nbsp;&nbsp;
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/rynstwrt/EditorPerRepoElectron?style=for-the-badge&color=%23f765af)&nbsp;&nbsp;


![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rynstwrt/EditorPerRepoElectron?style=for-the-badge&color=%23FF6600)
</div>



<br>



## [ FEATURES ]
<img align="right" src="media/screenshot1.png" alt="EPR editor select menu">

- Feature
- List
- Coming
- Soon



<br clear="both">
<br clear="both">



<h2>[ INSTALLATION ]</h2>
<img align="left" src="media/screenshot1.png" alt="EPR editor select menu">

<p align="right">

### Standalone:
1\. Download the standalone archive.  
2\. Extract it to a folder and store it somewhere safe.

### Installer:
1\. Download the installer `.exe` file.  
2\. Double-click it to install.  
3\. It will be installed to `%LOCALAPPDATA%/EditorPerRepo`.
</p>



<br clear="both">
<br clear="both">



## [ USAGE ]
<img align="right" src="media/screenshot1.png" alt="EPR editor select menu">

1. Open GitHub Desktop.
2. `File > Options > Integrations`.
3. Select `Configure custom editor...` under "External editor".
4. Select the `.exe` file of EditorPerRepo under the "Path" section.
5. Put one of these as the value under "Arguments":
    - `%TARGET_PATH%`
    - `target=%TARGET_PATH%`
    - `target="%TARGET_PATH%"`
6. Save your settings and return to the main UI.
7. Click on `Repository > Open in external editor` or press `CTRL+SHIFT+A`.
8. A window should pop up asking which editor to assign to that repo.
    - **If it fails for some reason, try one of the other "Arguments" values listed above.**