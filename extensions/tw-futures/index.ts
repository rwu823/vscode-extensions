import vsc from 'vscode'
import { TreeProvider } from './src/tree'
import * as consts from './src/consts'

export const activate = async (ctx: vsc.ExtensionContext) => {
  ctx
  const tree = new TreeProvider()
  const autoUpdate = () => {
    tree.refresh()

    setTimeout(autoUpdate, 1000)
  }

  vsc.window.registerTreeDataProvider('tw.futures', tree)

  vsc.commands.registerCommand(consts.commands.REFRESH, tree.refresh)

  autoUpdate()
}

export const deactivate = () => {}
