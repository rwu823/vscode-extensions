import * as vsc from 'vscode'
import path from 'path'
import commandOpen from './commands/open'
import commandSearch from './commands/search'

const { showStatusBar } = vsc.workspace.getConfiguration('open-folder')
export async function activate(ctx: vsc.ExtensionContext) {
  if (showStatusBar) {
    const status = vsc.window.createStatusBarItem(vsc.StatusBarAlignment.Right)
    if (vsc.window.activeTextEditor) {
      status.text = `📁${path.dirname(
        vsc.window.activeTextEditor.document.fileName,
      )}`
      status.text = status.text.replace(vsc.workspace.rootPath!, '')
      status.show()
    }

    status.command = 'open-folder.open'

    vsc.window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        status.text = `📁${path.dirname(editor.document.fileName)}`
        status.text = status.text.replace(vsc.workspace.rootPath!, '')
        status.show()
      } else {
        status.hide()
      }
    })
  }

  ctx.subscriptions.push(
    vsc.commands.registerCommand('open-folder.open', commandOpen),
    vsc.commands.registerCommand('open-folder.search', commandSearch),
  )
}

export function deactivate() {}
