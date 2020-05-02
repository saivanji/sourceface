module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["import", "react"],
  rules: {
    quotes: ["error", "double"],
    "comma-dangle": "off",
    "import/no-unresolved": ["error", { commonjs: true }],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
      },
    },
  },
}
