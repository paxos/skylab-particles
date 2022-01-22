export default {
  plugins: [
    '@snowpack/plugin-sass',
  ],
  root: "src",
  buildOptions: {
    out: "build",
  },
  optimize: {
    bundle: true,
    minify: true,
  },
};
