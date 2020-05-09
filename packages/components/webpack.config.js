const path = require("path")
const glob = require("glob")

const NODE_ENV = process.env.NODE_ENV || "production"
const isProd = NODE_ENV === "production"

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: "source-map",
  entry: glob.sync("./src/**/index.jsx").reduce((acc, p) => {
    const componentName = p.replace(/^\.\/src\/([a-z]+)\/index\.jsx$/i, "$1")
    return {
      ...acc,
      [componentName.toLowerCase()]: p,
    }
  }, {}),
  output: {
    path: path.resolve(__dirname),
    filename: isProd ? "[name]/prod/index.js" : "[name]/dev/index.js",
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
        test: /\.jsx?$/,
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
                localIdentName: isProd
                  ? "[hash:base64]"
                  : "[folder]_[local]_[hash:base64:5]",
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
