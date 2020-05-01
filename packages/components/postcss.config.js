// should be in a config package? most likely havng .browserslistrc in config package as well will be automatically resolved by postcss plugins

const atImport = require("postcss-import")
const autoprefixer = require("autoprefixer")
const presetEnv = require("postcss-preset-env")

module.exports = {
  plugins: [
    atImport(),
    autoprefixer,
    presetEnv({
      stage: 0,
      features: {
        "custom-properties": {
          preserve: false,
        },
      },
    }),
  ],
}
