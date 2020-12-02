/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import path from 'path'
import fs from 'fs'
import vscode from 'vscode'

import { stockAPI } from './utils'
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
    const res = await stockAPI<
      { contractName: string; updown: string; price: string }[]
    >('mCht/quotesApi/getQuotes', {
      searchParams: { objId: apiObjIDMap.TW_FUTURES_NIGHT },
    })

    const date: vscode.TreeItem = {
      description: new Date().toLocaleString(),
    }

    const children = res.body.map<vscode.TreeItem>((futures) => {
      const upDown = parseFloat(futures.updown)

      let iconPath = path.join(mediaPath, 'dash.svg')
      if (upDown > 0) iconPath = path.join(mediaPath, 'up.svg')
      else if (upDown < 0) iconPath = path.join(mediaPath, 'down.svg')

      const price = parseFloat(futures.price.replace(/,/g, ''))

      const base = upDown >= 0 ? price - upDown : price + upDown

      const p = ((Math.abs(upDown) / base) * 100).toFixed(2)

      return {
        label: `${futures.contractName} (${futures.price})`,
        description: `${upDown} / ${p}%`,
        iconPath,
        collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
      }
    })

    return [date, ...children]
  }

  refresh() {
    this.#emitter.fire()
  }
}
