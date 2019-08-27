import * as vsc from 'vscode'
import glob from 'fast-glob'

export default async (_uri: vsc.Uri) => {
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
    .then(sel => vsc.workspace.findFiles(`${sel}/**`))
    .then(fileUris => {
      fileUris.forEach(file =>
        vsc.window.showTextDocument(file, {
          preview: false,
          preserveFocus: true,
        }),
      )
    })
}
