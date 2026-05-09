import {defineConfig} from "oxlint"

export default defineConfig({
  ignorePatterns: ["dist/", "node_modules/"],
  jsPlugins: ["oxlint-plugin-aspizuism"],
  rules: {
    "aspizuism/block-style": "error",
    "aspizuism/func-style": "error",
    "aspizuism/no-comments": "error",
    "aspizuism/private-prefix": "error",
  },
  options: {typeAware: true},
})
