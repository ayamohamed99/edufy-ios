var config = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
  // by default mapped to IONIC_SOURCE_MAP_TYPE
  config.dev.devtool = '#inline-source-map';
  return config;
};
