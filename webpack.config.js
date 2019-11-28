module.exports = function() {
  return {
    // prevent webpack using eval-sourcemap
    devtool: 'source-map',
    entry: {
      main: './src/index.js',
      options: './src/options.js',
    }
  }
}