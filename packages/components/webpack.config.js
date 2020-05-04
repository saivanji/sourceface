const path = require("path")
const rules = require("@sourceface/config/client/webpack-rules.js")
const plugins = require("@sourceface/config/client/webpack-plugins.js")

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "index.js",
    libraryTarget: "umd",
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "react",
      root: "React",
    },
  },
  plugins,
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
}
