import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser"; // Import parser directly

export default [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser, // Use the imported parser object
    },
    plugins: {
      react: eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // No need for React import in React 17+
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },
];
