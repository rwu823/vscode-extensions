import * as vsc from 'vscode'
import glob from 'fast-glob'

export const search = async (_uri: vsc.Uri) => {
  const { rootPath } = vsc.workspace
  const settingSearch = vsc.workspace.getConfiguration('search')

  vsc.window
    .showQuickPick(
      await glob(`**`, {
        cwd: rootPath,
        onlyDirectories: true,
        ignore: Object.keys(settingSearch.exclude),
      }),
    )
    .then(sel => {
      vsc.commands.executeCommand(
        'open-folder.open',
        vsc.Uri.file(`${rootPath}/${sel}`),
      )
    })
}

export default search
