// config-overrides.js at project root
const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...(config.resolve ? config.resolve.fallback : {}),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      vm: false, // we don't need Node's vm in the browser
    },
  };

  return config;
};

