const Path = require('path');
const FS = require('fs');
const babelRc = JSON.parse(FS.readFileSync('./.babelrc'));

module.exports = {
  entry: Path.join(__dirname, 'src/ui-main'),
  output: {
    path: __dirname,
    filename: 'dist/ui-main.js',
    publicPath: '/',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: babelRc,
      }
    ]
  },
  target: 'node-webkit',
  externals: {
    'power-assert': 'commonjs power-assert',
    'selenium-webdriver': 'commonjs selenium-webdriver',
    'package': 'commonjs ./package.json',
    'getpid': 'commonjs getpid',
    'tree-kill': 'commonjs tree-kill',
    'driver': 'commonjs core/driver',
    'util': 'commonjs util/index',
  }
};
