import * as vsc from 'vscode'

export class CodeLens implements vsc.CodeLensProvider {
  private line: number = 1

  private command: vsc.Command | vsc.Command[]

  constructor(line: number, command: vsc.Command | vsc.Command[]) {
    this.line = line
    this.command = command
  }

  async provideCodeLenses(doc: vsc.TextDocument): Promise<vsc.CodeLens[]> {
    const text = doc.getText()
    const { line: lastLine } = doc.positionAt(text.length)

    const line = Math.min(Math.max(0, this.line - 1), lastLine)
    const range = new vsc.Range(line, 0, line, 0)

    const commands: vsc.Command[] = Array.prototype.concat(this.command)

    return commands.map(cmd => new vsc.CodeLens(range, cmd))
  }
}

export default CodeLens
