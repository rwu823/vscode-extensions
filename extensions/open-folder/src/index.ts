import * as vsc from 'vscode'
import * as command from './commands'
import { updateStatusBar } from './statusBar'

export async function activate(ctx: vsc.ExtensionContext) {
  updateStatusBar()
  vsc.window.onDidChangeActiveTextEditor(updateStatusBar)
  vsc.workspace.onDidChangeConfiguration(updateStatusBar)

  ctx.subscriptions.push(
    vsc.commands.registerCommand('open-folder.open', command.open),
    vsc.commands.registerCommand('open-folder.search', command.search),
  )
}

export function deactivate() {}
