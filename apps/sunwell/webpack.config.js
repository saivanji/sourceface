const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const isDev = !!process.env.WEBPACK_DEV_SERVER

module.exports = {
  mode: isDev ? "development" : "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /^\?raw$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  import: false,
                  modules: {
                    localIdentName: "[hash:base64]",
                  },
                  localsConvention: "camelCase",
                },
              },
              "postcss-loader",
            ],
          },
        ],
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.jsx$/,
        },
        use: {
          loader: "@svgr/webpack",
          options: {
            dimensions: false,
          },
        },
      },
    ],
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
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 3000,
    contentBase: path.resolve(__dirname, "static"),
  },
}
