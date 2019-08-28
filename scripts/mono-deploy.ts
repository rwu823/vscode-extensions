import sh from 'sh-exec'

import pkgJSON from '../package.json'

const { GITHUB_TOKEN } = process.env

const deploymentPackagesSet = new Set(['open-folder'])

const tokenRepo = pkgJSON.repository.replace(
  /^(https:\/\/)/,
  `$1${GITHUB_TOKEN}@`,
)

const getDeploymentPackages = async () => {
  const stdout = await sh`git diff --name-only HEAD~1`

  const modifiedPaths = (stdout.match(/^extensions\/([^/]+)/gm) || []).map(
    filePath => filePath.split('/')[1],
  )

  const uniqPackages = [...new Set(modifiedPaths)].filter(pkg =>
    deploymentPackagesSet.has(pkg),
  )

  return uniqPackages
}
;(async () => {
  const modifiedPackages = await getDeploymentPackages().catch(console.error)

  if (Array.isArray(modifiedPackages)) {
    if (modifiedPackages.length) {
      sh`
        git config --global user.name CircleCI
        git config --global user.email mono_deploy@circleci.com
      `

      sh.quiet`
        git push ${tokenRepo} --force ${modifiedPackages
        .map(pkg => `HEAD:refs/heads/prod/${pkg}`)
        .join(' ')}
      `
    } else {
      console.log(`No branches be deployed.`)
    }
  }
})()
