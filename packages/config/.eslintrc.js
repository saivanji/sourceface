module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "react"],
      extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    },
  ],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
  },
}
