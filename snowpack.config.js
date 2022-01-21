// snowpack.config.js
module.exports = {
  mount: {
    src: "/",
    public: "/",
  },
  buildOptions: {
    out: "dist",
  },
  plugins: [["@snowpack/plugin-webpack"]],
};
