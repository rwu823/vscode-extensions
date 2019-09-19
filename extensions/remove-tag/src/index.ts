import * as vsc from 'vscode'
import moo from 'moo'
import { jumpToMatchingTag, selectPairContents } from './commands'
import config from './configuration'
import {
  findMatchingTag,
  getTagForPosition,
  getTagsForPosition,
} from './tagMatcher'
import { parseTags } from './tagParser'
import TagStyler from './tagStyler'

const parser = moo.compile({
  // tagOpening: /<(?!\/)(?=>|\w)[\w-.:]*(?=[^]*>)(?=\s|\/?>)/,
  // tagClosing: /<\/\S*?>/,

  string: ['asdf'],

  // Closing tag
  // closingTag: /<\/.*>/,
})

const lexer = moo.compile({
  string: /".*"/, // greedy quantifier *
  // ...
})

export const activate = async (context: vsc.ExtensionContext) => {
  let markup = ''

  vsc.window.onDidChangeTextEditorSelection(() => {
    const editor = vsc.window.activeTextEditor
    if (
      !editor ||
      !/^(html|javascriptreact|typescriptreact)$/.test(
        editor.document.languageId,
      )
    ) {
      return
    }

    if (markup !== editor.document.getText()) {
      markup = editor.document.getText()

      lexer.reset(`asdf aldskf jlasdjf l`)
      debugger
    }

    // for (const next of parser) {
    //   console.log(next)
    // }
  })

  // let editorText: string = ''
  // let tagsList: hmt.PartialMatch[] = []

  // vsc.window.onDidChangeTextEditorSelection(evt => {
  //   const editor = evt.textEditor

  //   if (
  //     !config.isEnabled ||
  //     !editor ||
  //     editor !== vsc.window.activeTextEditor
  //   ) {
  //     return
  //   }

  //   if (editorText !== editor.document.getText()) {
  //     editorText = editor.document.getText()
  //     tagsList = parseTags(editorText, config.emptyElements)
  //   }

  //   // Highlight matching tags
  //   tagStyler.clearDecorations()

  //   let matches = []
  //   if (config.highlightFromContent) {
  //     matches = editor.selections
  //       .map(sel =>
  //         getTagForPosition(
  //           tagsList,
  //           editor.document.offsetAt(sel.active),
  //           config.highlightSelfClosing,
  //         ),
  //       )
  //       .filter(match => match !== undefined)
  //   } else {
  //     matches = editor.selections
  //       .map(sel =>
  //         findMatchingTag(
  //           tagsList,
  //           editor.document.offsetAt(sel.active),
  //           config.highlightFromName,
  //           config.highlightFromAttributes,
  //         ),
  //       )
  //       .filter(
  //         match =>
  //           match &&
  //           (match.opening !== match.closing || config.highlightSelfClosing),
  //       )
  //   }
  //   console.log(matches)
  //   matches.forEach(match => tagStyler.decoratePair(match as hmt.Match, editor))
  // })

  context.subscriptions.push(
    vsc.commands.registerCommand(
      'highlight-matching-tag.jumpToMatchingTag',
      jumpToMatchingTag,
    ),
  )

  context.subscriptions.push(
    vsc.commands.registerCommand(
      'highlight-matching-tag.selectPairContents',
      selectPairContents,
    ),
  )
}
