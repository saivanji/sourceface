const fs = require("fs")
const path = require("path")
const {
  colors,
  breakpoints,
  values,
  sizes,
  rounded,
  fontSizes,
  shadows,
} = require("./index")

const mapObj = (obj, fn) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...fn(key, obj[key]),
    }),
    {}
  )

const render = data =>
  Object.keys(data).reduce((acc, key) => acc + `$${key}: ${data[key]};\n`, "")

const colorsDefinition = mapObj(colors, (k, v) =>
  typeof v === "string"
    ? {
        [`color-${k}`]: v,
      }
    : mapObj(v, (_k, _v) => ({
        [`color-${k}-${_k}`]: _v,
      }))
)

const breakpointsDefinition = mapObj(breakpoints, (k, v) => ({
  [`break-${k}`]: v,
}))

const valuesDefinition = mapObj(values, (k, v) => ({
  [`value-${k}`]: v,
}))

const sizesDefinition = mapObj(sizes, (k, v) => ({
  [`size-${k}`]: v,
}))

const fontSizesDefinition = mapObj(fontSizes, (k, v) => ({
  [`font-size-${k}`]: v,
}))

const roundedDefinition = mapObj(rounded, (k, v) => ({
  [`rounded-${k}`]: v,
}))

const shadowsDefinition = mapObj(shadows, (k, v) => ({
  [`shadow-${k}`]: v,
}))

fs.writeFileSync(
  path.resolve(__dirname, "index.scss"),
  render({
    ...colorsDefinition,
    ...breakpointsDefinition,
    ...valuesDefinition,
    ...sizesDefinition,
    ...fontSizesDefinition,
    ...roundedDefinition,
    ...shadowsDefinition,
  }),
  "utf-8"
)
