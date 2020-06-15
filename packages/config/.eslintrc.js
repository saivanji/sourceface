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
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
  overrides: [
    {
      files: ["*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      parserOptions: { sourceType: "module" },
      plugins: ["@typescript-eslint", "react"],
    },
  ],
}
