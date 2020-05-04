const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const isDev = process.env.NODE_ENV === "development"

module.exports = {
  mode: isDev ? "development" : "production",
  devtool: isDev ? "cheap-module-source-map" : "source-map",
  optimization: {
    minimize: !isDev,
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname),
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
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
  },
}
