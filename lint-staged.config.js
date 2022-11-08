module.exports = {
  "**/*.{js,jsx,ts,tsx}": "eslint --fix",
  "./!(cypress)/**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit",
  "./cypress/**/*.ts": () => "tsc -p ./cypress/tsconfig.json --noEmit",
}
