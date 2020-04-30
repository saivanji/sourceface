const Values = require("values.js")
const gray = "#bdc3c7"
const white = "#ffffff"
const grayColor = new Values(gray)

const grayTints = grayColor.tints(7)
const grayShades = grayColor.shades(7)

const mapColors = items =>
  items.reduce(
    (acc, item, i) =>
      Object.assign({}, acc, {
        [i + 1 + "0"]: `#${item.hex}`,
      }),
    {}
  )

exports.colors = {
  white,
  gray,
  "gray-tint": mapColors(grayTints),
  "gray-shade": mapColors(grayShades),
}

exports.spacings = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
}

// same as spacings
exports.sizes = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
}

exports.rounded = {
  sm: "",
  base: "",
  md: "",
  lg: "",
  full: "",
}
