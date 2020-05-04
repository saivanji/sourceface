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
