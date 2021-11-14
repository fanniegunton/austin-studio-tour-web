module.exports = {
  parser: "babel-eslint",
  extends: [
    "standard",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react-hooks"],
  rules: {
    "prettier/prettier": "warn",
    "react/display-name": "off",
    "react/prop-types": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  env: {
    jest: true,
  },
  settings: {
    react: {
      version: "detect",
    },

    // This configuration tells eslint-plugin-import to use
    // the webpack resolver, and configures the webpack resolver
    // to match the Gatsby webpack configuration. Our webpack
    // config mostly comes from Gatsby, and we augment it in our
    // gatsby-node.js file in the onCreateWebpackConfig function.
    "import/resolver": {
      webpack: {
        config: {
          resolve: {
            modules: ["src", "node_modules"],
            extensions: [".js", ".jsx"],
          },
        },
      },
    },
  },
}
