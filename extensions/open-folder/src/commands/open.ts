import { exec } from 'child_process'
import * as vsc from 'vscode'
import glob from 'fast-glob'
import path from 'path'
import fs from 'fs'

export default async (uri: vsc.Uri) => {
  let dir = '.'

  if (uri) {
    const stat = fs.statSync(uri.path)
    dir = stat.isFile() ? path.dirname(uri.path) : uri.path
  } else if (vsc.window.activeTextEditor) {
    dir = path.dirname(vsc.window.activeTextEditor.document.fileName)
  }

  const files = await glob(`${dir}/**/*`, {
    onlyFiles: true,
  })

  exec(`code -r ${files.map(file => `'${file}'`).join(' ')}`)
}
