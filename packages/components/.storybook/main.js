const custom = require("../webpack.config")

module.exports = {
  stories: ["../src/**/*.stories.jsx"],
  webpackFinal: config => {
    return {
      ...config,
      module: { ...config.module, rules: custom.module.rules },
    }
  },
}
