const rules = require("@sourceface/config/client/webpack-rules.js")
const plugins = require("@sourceface/config/client/webpack-plugins.js")

module.exports = {
  stories: ["../src/**/*.stories.jsx"],
  webpackFinal: config => {
    return {
      ...config,
      module: { ...config.module, rules },
      plugins: [...config.plugins, ...plugins],
    }
  },
}
