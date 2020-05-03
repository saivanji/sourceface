const rules = require("@sourceface/config/client/webpack-rules.js")

module.exports = {
  stories: ["../src/**/*.stories.jsx"],
  webpackFinal: config => {
    return {
      ...config,
      module: { ...config.module, rules },
    }
  },
}
