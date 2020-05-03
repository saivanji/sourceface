const path = require("path")
const rules = require("@sourceface/config/client/webpack-rules.js")

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.[contenthash].js",
  },
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
}
