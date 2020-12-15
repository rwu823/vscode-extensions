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
      ({ name, base, close }) => {
        let iconPath = path.join(mediaPath, 'dash.svg')
        if (close > base) iconPath = path.join(mediaPath, 'up.svg')
        else if (close < base) iconPath = path.join(mediaPath, 'down.svg')

        const diff = close - base

        return {
          iconPath,
          label: `${name} ${close}`,
          description: `${diff} ${((Math.abs(diff) / base) * 100).toFixed(2)}%`,
        }
      },
    )

    return [date, ...children]
  }

  refresh() {
    this.#emitter.fire()
  }
}
