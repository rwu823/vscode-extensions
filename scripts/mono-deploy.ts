import sh from 'sh-exec'

const { TOKEN_REPO } = process.env

const deploymentPackagesSet = new Set(['open-folder'])
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
        git push ${TOKEN_REPO} --force ${modifiedPackages
        .map(pkg => `HEAD:refs/heads/prod/${pkg}`)
        .join(' ')}
      `
    } else {
      console.log(`No branches be deployed.`)
    }
  }
})()
