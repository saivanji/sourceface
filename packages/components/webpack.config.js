const path = require("path")
const postcssCustomProperties = require("postcss-custom-properties")
const atImport = require("postcss-import")

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
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              import: false,
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]",
              },
              localsConvention: "camelCase",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                atImport(),
                postcssCustomProperties({ preserve: false }),
              ],
            },
          },
        ],
      },
    ],
  },
}
