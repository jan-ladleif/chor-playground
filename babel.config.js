module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/env",
    "@babel/typescript"
  ];
  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ];

  return {
    presets,
    plugins
  };
}