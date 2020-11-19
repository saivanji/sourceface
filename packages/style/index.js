exports.colors = {
  white: "#fff",
  gray: {
    100: "hsla(216, 33%, 98%, 1)",
    200: "hsla(218, 28%, 95%, 1)",
    300: "hsla(216, 26%, 92%, 1)",
    400: "hsla(212, 24%, 86%, 1)",
    500: "hsla(218, 21%, 80%, 1)",
    600: "hsla(210, 21%, 65%, 1)",
    700: "hsla(211, 17%, 48%, 1)",
    800: "hsla(208, 26%, 33%, 1)",
    900: "hsla(215, 49%, 14%, 1)",
  },
  blue: {
    100: "hsla(205, 77%, 96%, 1)",
    200: "hsla(203, 73%, 87%, 1)",
    300: "hsla(204, 71%, 75%, 1)",
    400: "hsla(207, 68%, 63%, 1)",
    500: "hsla(210, 64%, 47%, 1)",
    600: "hsla(210, 67%, 42%, 1)",
    700: "hsla(208, 71%, 37%, 1)",
    800: "hsla(208, 75%, 30%, 1)",
    900: "hsla(207, 82%, 22%, 1)",
  },
  red: {
    100: "hsla(358, 91%, 94%, 1)",
    200: "hsla(358, 95%, 87%, 1)",
    300: "hsla(358, 90%, 80%, 1)",
    400: "hsla(358, 75%, 66%, 1)",
    500: "hsla(358, 62%, 52%, 1)",
    600: "hsla(357, 70%, 42%, 1)",
    700: "hsla(354, 84%, 35%, 1)",
    800: "hsla(354, 90%, 27%, 1)",
    900: "hsla(360, 94%, 20%, 1)",
  },
}

const theme = {
  mode: "light | dark",
  palette: {}, // colors
}

exports.leading = {
  "3": ".75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
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

exports.fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
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

/* eslint-disable */
exports.fonts = {
  nunito: '"Nunito", sans-serif',
  montserrat: '"Montserrat", sans-serif',
}
/* eslint-enable */

exports.rounded = {
  sm: "0.25rem",
  // TODO: have .375 instead?
  base: "0.3125rem",
  full: "9999px",
}

exports.shadows = {
  base: "0 2px 5px hsla(0, 0%, 0%, 0.2)",
}

exports.breakpoints = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
}
