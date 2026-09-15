// modules: "commonjs" is explicit (not left to preset-env's "auto" default) because Babel 8 +
// this project's babel-jest version no longer negotiate the CJS-output signal Jest needs —
// "auto" sees the `node: "current"` target supports ESM natively and leaves import/export
// untouched, which Jest's CJS module system can't load ("Must use import to load ES Module").
// Only surfaced once a source file under test had real imports of its own (authService.js
// importing axios/apiClient) — this file only runs under Jest, so it has no effect on the real
// Vite/Node builds.
//
// Every service file reads config via `import.meta.env.VITE_*` (Vite's own env mechanism) —
// standard Babel/Jest has no idea what `import.meta` is and leaves it untouched even after the
// commonjs transform above, which is a syntax error once that code runs outside an ES module
// record. This plugin rewrites `import.meta` to `{ env: process.env }` so `import.meta.env.X`
// becomes `process.env.X` under Jest; harmless everywhere else since Vite never runs this
// config (see the comment above — Jest-only). Also latent until now: no earlier test exercised
// any file using import.meta.env.
function stubImportMetaEnv() {
  return {
    visitor: {
      MetaProperty(path) {
        path.replaceWithSourceString("({ env: process.env })");
      },
    },
  };
}

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }],
    "@babel/preset-react",
  ],
  plugins: [stubImportMetaEnv],
};
