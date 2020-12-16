module.exports = {
  env: {
    browser: true,
    jest: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      "babel-plugin-root-import": {
        rootPathSuffix: "./src",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
  rules: {
    "prettier/prettier": "error",
    "no-await-in-loop": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
  },
};
