
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    content: path.join(src, 'content'),
    background: path.join(src, 'background'),
    options: path.join(src, 'options'),
    popup: path.join(src, 'popup')
  },

  output: {
    path: dist,
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'es2015' ]
        }
      }
    ]
  },

  resolve: {
    extensions: [ '.js' ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'src/options/index.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'src/popup/index.html',
      injecdt: false
    })
  ]

};


