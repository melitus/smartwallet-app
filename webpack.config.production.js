var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: [
    './src/js/main.jsx'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    root: path.resolve(__dirname) + '/src/js',
    alias: {
      actions: 'actions',
      components: 'components',
      stores: 'stores',
      lib: 'lib',
      styles: 'styles',
      settings: path.resolve(__dirname) + '/config/production.js'
    }
  },
  output: {
    path: path.resolve(__dirname) + '/dist/js',
    filename: 'bundle.js',
    publicPath: 'js/'
  },
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  plugins: [],
  module: {
    loaders: [
      {
        test:   /\.jsx?/,
        loader: 'babel',
        include: path.resolve(__dirname) + '/src/js',
        exclude: 'node_modules'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}