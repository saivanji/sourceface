const fs = require("fs")
const path = require("path")
const { colors, values, rounded, fontSizes } = require("./index")

const mapObj = (obj, fn) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...fn(key, obj[key]),
    }),
    {}
  )

const renderCss = data =>
  ":root {\n" +
  Object.keys(data).reduce(
    (acc, key) => acc + `  --${key}: ${data[key]};\n`,
    ""
  ) +
  "}"

const colorsDefinition = mapObj(colors, (k, v) =>
  typeof v === "string"
    ? {
        [`color-${k}`]: v,
      }
    : mapObj(v, (_k, _v) => ({
        [`color-${k}-${_k}`]: _v,
      }))
)

const valuesDefinition = mapObj(values, (k, v) => ({
  [`value-${k}`]: v,
}))

const fontSizesDefinition = mapObj(fontSizes, (k, v) => ({
  [`font-size-${k}`]: v,
}))

const roundedDefinition = mapObj(rounded, (k, v) => ({
  [`rounded-${k}`]: v,
}))

fs.writeFileSync(
  path.resolve(__dirname, "index.css"),
  renderCss({
    ...colorsDefinition,
    ...valuesDefinition,
    ...fontSizesDefinition,
    ...roundedDefinition,
  }),
  "utf-8"
)
