module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
  },
  overrides: [
    {
      files: ["*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "react"],
      rules: {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
      },
    },
  ],
}
