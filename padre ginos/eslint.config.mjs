// import js from "@eslint/js";
// import globals from "globals";
// import prettier from "eslint-config-prettier";
// import reactPlugin from "eslint-plugin-react";
// import pluginQuery from "@tanstack/eslint-plugin-query";

// /** @type {import('eslint').Linter.Config} */
// export default [
//     js.configs.recommended,
//     {
//         ...reactPlugin.configs.flat.recommended,
//         settings: { react: { version: "detect" } },
//     },
//     ...reactPlugin.configs.flat["jsx-runtime"],
//     ...pluginQuery.configs["flat/recommended"],
//     {
//         files: ["**/*.js", "**/*.jsx"],
//         languageOptions: {
//             globals: {
//                 ...globals.browser,
//                 ...globals.node,
//             },
//             parserOptions: {
//                 ecmaFeatures: {
//                     jsx: true,
//                 }
//             }
//         },
//         rules: {
//             "react/no-unescaped-entities": "off",
//             "react/prop-types": "off",
//         }
//     },
//     prettier,
// ];

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["dist", "coverage", "src/routeTree.gen.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { react },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  {
  files: ["*.js", "*.mjs"],
  ...tseslint.configs.disableTypeChecked,
  },
  prettier,
];