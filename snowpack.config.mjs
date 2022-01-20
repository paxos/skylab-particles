// Example: snowpack.config.mjs
// The added "@type" comment will enable TypeScript type information via VSCode, etc.

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  root: "src",
  buildOptions: {
    out: "build"
  },
  optimize: {
    bundle: true,
    minify: true
  },
};
