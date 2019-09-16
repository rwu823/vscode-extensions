import * as vsc from 'vscode'
import { basename } from 'path'
import fs from 'fs'
import * as command from './commands'

export async function activate(ctx: vsc.ExtensionContext) {
  vsc.window.showInformationMessage('hello')

  vsc.window.onDidChangeActiveTextEditor(() => {
    if (vsc.window.activeTextEditor) {
      if (
        basename(vsc.window.activeTextEditor.document.fileName) ===
        'package.json'
      ) {
        console.log(vsc.workspace.workspaceFolders)
        // const x = fs.readFileSync('yarn.lock')
      }
    }
  })

  // ctx.subscriptions.push(
  //   vsc.commands.registerCommand('open-folder.open', command.open),
  //   vsc.commands.registerCommand('open-folder.search', command.search),
  // )
}

export function deactivate() {}
