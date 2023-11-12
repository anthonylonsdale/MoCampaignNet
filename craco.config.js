// craco.config.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Add a fallback for the buffer module
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback, // spread the existing fallbacks
        buffer: require.resolve('buffer/'),
      }

      // Provide plugin for Buffer
      webpackConfig.plugins = [
        ...webpackConfig.plugins, // spread existing plugins
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ]

      return webpackConfig
    },
  },
  // Other CRACO configurations...
}
