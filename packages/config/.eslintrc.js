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
    // "import/no-unresolved": ["error", { commonjs: true }],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
  // settings: {
  //   "import/resolver": {
  //     node: {
  //       extensions: [".ts", ".tsx"],
  //       moduleDirectory: ["node_modules", "src/"],
  //     },
  //   },
  // },
}
