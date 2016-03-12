const Path = require('path');

module.exports = {
  entry: Path.join(__dirname, 'src/ui-main'),
  output: {
    path: Path.join(__dirname, '/dist'),
    filename: 'ui-main.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'jsx'
      }
    ]
  },
  target: 'node-webkit'
};