const custom = require("../webpack.config.js")

module.exports = {
  stories: ["../src/**/*.stories.jsx"],
  addons: ["@storybook/addon-knobs/register", "@storybook/addon-a11y/register"],
  webpackFinal: config => {
    return {
      ...config,
      module: { ...config.module, rules: custom.module.rules },
    }
  },
}
