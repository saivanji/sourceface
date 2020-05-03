const fs = require("fs")
const path = require("path")

module.exports = [
  {
    test: /\.jsx?$/,
    exclude: /(node_modules)/,
    use: {
      loader: resolveLoader("babel-loader"),
    },
  },
  {
    test: /\.css$/,
    use: [
      resolveLoader("style-loader"),
      {
        loader: resolveLoader("css-loader"),
        options: {
          import: false,
          modules: {
            localIdentName: "[hash:base64]",
          },
          localsConvention: "camelCase",
        },
      },
      resolveLoader("postcss-loader"),
    ],
  },
  {
    test: /\.svg$/,
    issuer: {
      test: /\.jsx$/,
    },
    use: {
      loader: resolveLoader("@svgr/webpack"),
      options: {
        dimensions: false,
      },
    },
  },
]

const resolveLoader = (name, context = __dirname) => {
  const modulePath = path.resolve(context, "node_modules", name)

  if (!fs.existsSync(modulePath)) {
    return resolveLoader(name, path.resolve(context, "../"))
  }

  return modulePath
}
