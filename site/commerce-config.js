/**
 * This file is expected to be used in next.config.js only
 */

const path = require('path')
const merge = require('deepmerge')
const core = require('@vercel/commerce/config')

function withCommerceConfig(nextConfig = {}) {
  const config = merge(
    { commerce: { provider: '@vercel/commerce-vendure' } },
    nextConfig
  )
  const { commerce } = config
  const { provider } = commerce

  // The module path is a symlink in node_modules
  // -> /node_modules/[name]/dist/index.js
  const absolutePath = require.resolve(provider)
  // but we want references to go to the real path in /packages instead
  // -> packages/[name]/dist
  const distPath = path.join(path.relative(process.cwd(), absolutePath), '..')
  // -> /packages/[name]/src

  // To improve the DX of using references, we'll switch from `src` to `dist`
  // only for webpack so imports resolve correctly but typechecking goes to `src`
  config.webpack = (cfg) => {
    if (Array.isArray(cfg.resolve.plugins)) {
      const jsconfigPaths = cfg.resolve.plugins.find(
        (plugin) => plugin.constructor.name === 'JsConfigPathsPlugin'
        )
        
        if (jsconfigPaths) {
          jsconfigPaths.paths['@framework'] = [distPath]
          jsconfigPaths.paths['@framework/*'] = [`${distPath}/*`]
        }
      }

    return cfg
  }

  return core.withCommerceConfig(config)
}

module.exports = { withCommerceConfig }
