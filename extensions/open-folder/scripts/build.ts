import sh from 'sh-exec' // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs'

const pkg = require('../package.json')

const { publisher, repository, author } = require('../../../package.json')

const writeFile = (pathName: string, data: string) =>
  new Promise(done => {
    const ws = fs.createWriteStream(pathName)

    ws.write(data)
    ws.end()
    ws.on('close', done)
  })
;(async () => {
  await writeFile(
    'released/package.json',
    JSON.stringify({ ...pkg, publisher, repository, author }, null, 2),
  )
  await sh`
    yarn tsc -b

    cp -r out media README.md CHANGELOG.md released

    cd released
    npm i --no-package-lock

    rm -rf $(find . -name '*.map')
    rm -rf $(find node_modules -name '*.d.ts' -o -name '*.md' -o -name 'LICENSE')

    vsce publish
    `
})()
