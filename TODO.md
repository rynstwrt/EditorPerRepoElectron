# TODO.md


## Upcoming:
- Check that when app is packaged that `BYPASS_ASSIGNMENTS` is ignored.
- Make the last used editor be the first value in the editor select list.
- Add config option for running editor as admin.
- Add way to manually edit path text in editor select menu.
- Change window launched when opening without a specified path to explain how to use the app.


## Potentially:
- Change to `electron-builder` instead of `electron-forge`.
- Changeable themes.
- Change editor data storage to use simple `(dirPath,editorExecutablePath)` pairs.
  - Previously used editors are suggested when assigning an editor to a repo (instead of having to pre-add them as an editor).
  - This means there's no need for separate editors and assignments sections.