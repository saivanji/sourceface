const path = require("path")
const pkg = require("./package.json")

const NODE_ENV = process.env.NODE_ENV || "production"
const isProd = NODE_ENV === "production"

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: isProd ? "index.min.js" : "index.js",
    libraryTarget: "umd",
  },
  externals: Object.keys(
    Object.assign({}, pkg.dependencies, pkg.peerDependencies)
  ).reduce((acc, key) => Object.assign({}, acc, { [key]: key }), {}),
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
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: isProd
                  ? "[hash:base64]"
                  : "[folder]_[local]_[hash:base64:5]",
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
