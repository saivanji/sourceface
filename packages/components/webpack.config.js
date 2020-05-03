const path = require("path")
const rules = require("@sourceface/config/client/webpack-rules.js")

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
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
}
