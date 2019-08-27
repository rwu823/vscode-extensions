import fs from 'fs'
import path from 'path'
import * as vsc from 'vscode'

export default async (uri: vsc.Uri) => {
  let fullDirPath = '.'

  if (uri) {
    const stat = fs.statSync(uri.path)
    fullDirPath = stat.isFile() ? path.dirname(uri.path) : uri.path
  } else if (vsc.window.activeTextEditor) {
    fullDirPath = path.dirname(vsc.window.activeTextEditor.document.fileName)
  }

  const dir = path.relative(vsc.workspace.rootPath!, fullDirPath)

  const fileUris = await vsc.workspace.findFiles(`${dir}/**`)

  fileUris.forEach(file =>
    vsc.window.showTextDocument(file, { preview: false, preserveFocus: true }),
  )
}
