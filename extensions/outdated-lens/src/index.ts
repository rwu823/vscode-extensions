import * as vsc from 'vscode'
import { basename } from 'path'
import fs from 'fs'
import * as command from './commands'
import { CodeLens } from './@share'

export async function activate(_ctx: vsc.ExtensionContext) {
  vsc.window.showInformationMessage('hello')

  vsc.window.onDidChangeActiveTextEditor(() => {
    if (vsc.window.activeTextEditor) {
      if (
        basename(vsc.window.activeTextEditor.document.fileName) ===
        'package.json'
      ) {
        // const x = fs.readFileSync('yarn.lock')
      }
    }
  })
  // vsc.languages.registerCodeLensProvider({
  //   language: 'json',
  //   scheme: 'file',
  // })
  // ctx.subscriptions.push(
  //   vsc.commands.registerCommand('open-folder.open', command.open),
  //   vsc.commands.registerCommand('open-folder.search', command.search),
  // )

  const cl = vsc.languages.registerCodeLensProvider(
    {
      language: 'json',
      scheme: 'file',
      pattern: '**/package.json',
    },
    new CodeLens(10, [
      {
        title: 'code-lens',
        command: 'a.b.c',
      },
      {
        title: 'code-lens2',
        command: 'a.b.c2',
      },
    ]),
  )
}

export function deactivate() {}
