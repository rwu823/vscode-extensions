import * as vsc from 'vscode'

export type Config = vsc.WorkspaceConfiguration &
  Readonly<{
    showStatusBar: boolean
  }>
