const fs = require("fs")
const path = require("path")
const { colors, spacings } = require("./index")

const spacingsDefinition = Object.keys(spacings).reduce(
  (acc, n) => acc + `  --space-${n}: ${spacings[n]};\n`,
  ""
)

const colorsDefinition = Object.keys(colors).reduce(
  (acc, color) =>
    acc +
    (typeof colors[color] === "string"
      ? `  --color-${color}: ${colors[color]};\n`
      : Object.keys(colors[color]).reduce(
          (acc, n) => acc + `  --color-${color}-${n}: ${colors[color][n]};\n`,
          ""
        )),
  ""
)

const css = `:root {\n${spacingsDefinition}${colorsDefinition}}`

fs.writeFileSync(path.resolve(__dirname, "index.css"), css, "utf-8")
