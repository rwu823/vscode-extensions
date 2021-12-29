import vsc from 'vscode'

export const activate = async (_ctx: vsc.ExtensionContext) => {
  vsc.window.showErrorMessage('11111111')
  vsc.window.showInformationMessage('hello world')
}

export const deactivate = () => {}
