const Path = require('path');

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
        query: {
          presets: ['react'],
          plugins: [
            'transform-es2015-modules-commonjs',
            // FluxContainer needs this
            'transform-es2015-classes',
            'transform-async-to-generator',
            'transform-class-properties'
          ]
        }
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
