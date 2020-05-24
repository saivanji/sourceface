const Values = require("values.js")
const primary = "#bdc3c7"
const light = "#ffffff"
const dark = "#000000"
const primaryColor = new Values(primary)

const primaryTints = primaryColor.tints(7)
const primaryShades = primaryColor.shades(7)

const mapColors = items => items.map(item => `#${item.hex}`)

exports.colors = {
  light: light,
  dark: dark,
  // TODO: have one color scale instead of 3?
  // mono: {
  //   base: {},
  //   tints: {},
  //   shades: {},
  // },
  primary: {
    base: primary,
    tints: mapColors(primaryTints),
    shades: mapColors(primaryShades),
  },
  // secondary: {
  //   base: {},
  //   tints: {},
  //   shades: {},
  // },
}

const theme = {
  mode: "light | dark",
  palette: {}, // colors
}

exports.values = {
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

exports.sizes = {
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
}

exports.fontSizes = {
  xs: ".75rem",
  sm: ".875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "4rem",
}

exports.rounded = {
  sm: "0.125rem",
  base: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
}

exports.shadows = {
  xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
}

exports.breakpoints = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
}

// exports.color = (name, depth) => theme => {
//   const palette = (theme && theme.palette) || exports.palettes.light
//   const color = palette[name]

//   return typeof color === "string" ? color : color[depth]
// }

exports.color = () => () => {}

// exports.css = (...args) => {
//   let cachedTheme
//   const funcs = args.reduce((acc, el, i) => {
//     if (typeof el !== "function") return acc
//     el.i = i
//     return [...acc, el]
//   }, [])

//   return theme => {
//     if (theme !== cachedTheme && funcs.length > 0) {
//       cachedTheme = theme
//       console.log(theme)

//       for (let i = 0; i < funcs.length; i++) {
//         args[funcs[i].i] = funcs[i](theme)
//       }
//     }

//     return css.apply(undefined, args)
//   }
// }
