const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const isDev = !!process.env.WEBPACK_DEV_SERVER
const { PORT } = process.env

module.exports = {
  mode: isDev ? "development" : "production",
  devtool: isDev && "cheap-module-source-map",
  entry: "./src/index.tsx",
  optimization: {
    minimize: !isDev,
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.[contenthash].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isDev
                  ? "[folder]_[local]_[hash:base64:5]"
                  : "[hash:base64]",
              },
              localsConvention: "camelCase",
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.tsx$/,
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
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFields: ["browser", "main"],
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
    port: PORT,
    contentBase: path.resolve(__dirname, "static"),
    stats: "errors-only",
  },
}
