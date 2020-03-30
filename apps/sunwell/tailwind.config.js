const Values = require("values.js")
const primary = "#1D64DE"
const secondary = "#17AD3F"
const attention = "#FFCD12"
const error = "#DB5E14"
const gray = "#bdc3c7"
const white = "#ffffff"
const primaryColor = new Values(primary)
const grayColor = new Values(gray)
const errorColor = new Values(error)

const primaryTints = primaryColor.tints(7)
const primaryShades = primaryColor.shades(7)

const grayTints = grayColor.tints(21)
const grayShades = grayColor.shades(21)

const errorTints = errorColor.tints(7)
const errorShades = errorColor.shades(7)

const mapColors = (items) =>
  items.reduce(
    (acc, item, i) =>
      Object.assign({}, acc, {
        [i + 1 + "0"]: `#${item.hex}`,
      }),
    {}
  )

module.exports = {
  variants: {
    visibility: ["responsive"],
    backgroundColor: ["hover", "focus", "active"],
  },
  theme: {
    colors: {
      white,
      primary,
      "primary-tint": mapColors(primaryTints),
      "primary-shade": mapColors(primaryShades),
      gray,
      "gray-tint": mapColors(grayTints),
      "gray-shade": mapColors(grayShades),
      error,
      "error-tint": mapColors(errorTints),
      "error-shade": mapColors(errorShades),
    },
    boxShadow: {
      "primary-outline": `0 0 0 2px #${primaryTints[11].hex}`,
      "error-outline": `0 0 0 2px #${errorTints[11].hex}`,
    },
  },
  plugins: [],
}
