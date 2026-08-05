// dependency-cruiser configuration for the phase-2 maintainability audit.
// Lives under .github/ (the scanning harness) so the application tree stays
// byte-identical to the pinned commit; see the planning repo's PLAN-003 and
// phase-2-tool-selection.md section 4.5(a). This is the only maintainability
// instrument that speaks to *architecture* (the module graph) rather than
// file-level quality, so the rules below assert the two things a module graph
// can assert about NodeGoat: no import cycles, and a layering direction (the
// data layer must not depend on the route layer).
//
// Paths in `from`/`to`/`exclude` are relative to the directory dependency-cruiser
// is invoked from (the repo root), NOT to this file's location.
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      comment: "A cycle between modules makes either one impossible to reason about in isolation.",
      severity: "warn",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-orphans",
      comment: "A module reachable from nothing is dead weight (or loaded only by a <script> tag, i.e. invisible to the Node graph).",
      severity: "warn",
      from: { orphan: true, pathNot: ["\\.(json|d\\.ts)$"] },
      to: {},
    },
    {
      name: "data-not-to-routes",
      comment: "DAOs (app/data) must not depend on route handlers (app/routes) - that inverts the layering.",
      severity: "error",
      from: { path: "^app/data/" },
      to: { path: "^app/routes/" },
    },
    {
      name: "no-deprecated-core",
      comment: "Node core modules that have been deprecated.",
      severity: "warn",
      from: {},
      to: { dependencyTypes: ["core"], path: ["^(punycode|domain|constants|sys|_linklist|_stream_wrap)$"] },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules|app/assets/vendor",
    },
    exclude: {
      path: "node_modules|app/assets/vendor|\\.github/",
    },
    tsPreCompilationDeps: false,
    combinedDependencies: false,
    // NodeGoat is CommonJS (require), not ES modules.
    moduleSystems: ["cjs", "amd", "es6"],
  },
};
