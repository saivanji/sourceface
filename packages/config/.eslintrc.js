module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "react"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
      rules: {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
      },
    },
  ],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
  },
}
