/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import path from 'path'
import fs from 'fs'
import vscode from 'vscode'
import { format } from 'date-fns'

import { getPoints, getTWZone } from './utils'
import { apiObjIDMap, mediaPath } from './consts'

export class TreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  #emitter = new vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  >()

  readonly onDidChangeTreeData = this.#emitter.event

  getTreeItem(item: vscode.TreeItem) {
    return item
  }

  async getChildren(
    item?: vscode.TreeItem & { upDown: number },
  ): Promise<vscode.TreeItem[]> {
    const date: vscode.TreeItem = {
      description: `${format(getTWZone(), 'E MM/dd HH:mm:ssX', {})}`,
    }

    const children = await (await getPoints()).map<vscode.TreeItem>(
      ({ Change, Name, ChangePercent, Close, PreviousClose }) => {
        let iconPath = path.join(mediaPath, 'dash.svg')
        if (Close > PreviousClose) iconPath = path.join(mediaPath, 'up.svg')
        else if (Close < PreviousClose)
          iconPath = path.join(mediaPath, 'down.svg')

        return {
          iconPath,
          label: `${Name} ${Close}`,
          description: `${Change}(${ChangePercent}%)`,
        }
      },
    )

    return [date, ...children]
  }

  refresh() {
    this.#emitter.fire()
  }
}
