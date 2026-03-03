// https://docs.expo.dev/guides/using-eslint/
import js from "@eslint/js";
import expoConfig from 'eslint-config-expo/flat';
import { defineConfig } from "eslint/config";

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],files: ["**/*.jsx"],
		plugins: {
			js,
		},
		extends: ["js/recommended"],
		rules: {
			"no-unused-vars": "off",
		},
  },
]);
