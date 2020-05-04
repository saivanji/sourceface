const custom = require("../webpack.config.js")

module.exports = {
  stories: ["../src/**/*.stories.jsx"],
  webpackFinal: config => {
    return {
      ...config,
      module: { ...config.module, rules: custom.module.rules },
      plugins: [...config.plugins, ...custom.plugins],
    }
  },
}
