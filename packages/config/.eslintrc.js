module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint", "react"],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
}
