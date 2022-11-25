const commerce = require('./commerce.config.json')
const { withCommerceConfig } = require('./commerce-config')

module.exports = withCommerceConfig({
  commerce,
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // Rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.
      process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL && {
        source: `${process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL}/:path*`,
        destination: `${process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL}/:path*`,
      },
    ].filter(Boolean)
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
