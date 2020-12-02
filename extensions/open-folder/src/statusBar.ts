import path from 'path'
import * as vsc from 'vscode'
import { Config } from './types'

const status = vsc.window.createStatusBarItem(vsc.StatusBarAlignment.Right)

export const updateStatusBar = () => {
  const { showStatusBar } = vsc.workspace.getConfiguration(
    'open-folder',
  ) as Config

  if (showStatusBar && vsc.window.activeTextEditor) {
    status.text = `📁${path.dirname(
      vsc.window.activeTextEditor.document.fileName,
    )}`.replace(vsc.workspace.rootPath!, '')

    status.command = 'open-folder.open'
    status.show()
  } else {
    status.hide()
  }
}
