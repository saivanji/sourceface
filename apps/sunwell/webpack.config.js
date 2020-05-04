const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const rules = require("@sourceface/config/client/webpack-rules.js")

const { WEBPACK_DEV_SERVER } = process.env

module.exports = {
  mode: WEBPACK_DEV_SERVER ? "development" : "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.[contenthash].js",
  },
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  plugins: [
    new HtmlPlugin({
      template: path.resolve(__dirname, "static", "index.html"),
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin([{ from: path.resolve(__dirname, "static") }]),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    contentBase: path.resolve(__dirname, "static"),
  },
}
