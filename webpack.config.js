module.exports = function () {
  return {
    // prevent webpack using eval-sourcemap
    devtool: 'source-map',
    entry: {
      main: './src/index.js',
      options: './src/options.js',
    },
    /* these entries are needed to teach webpack we are not interested in any node libraries */
    /* present in our source code, as we are only building for the web */
    resolve: {
      fallback: {
        crypto: false,
        path: false,
      }
    }
  }
}