import { exec } from 'child_process'
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
    .then(sel =>
      glob(`${rootPath}/${sel}/**`, {
        onlyFiles: true,
      }),
    )
    .then(files => {
      exec(`code -r ${files.map(file => `'${file}'`).join(' ')}`)
    })
}
