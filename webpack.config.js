const path = require("path");
const webpack = require("webpack");

const src = path.resolve(__dirname, "src");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  mode: "development",

  entry: {
    content: path.join(src, "scripts/content"),
    background: path.join(src, "scripts/background"),
    options: path.join(src, "scripts/options")
  },

  output: {
    path: dist,
    filename: "[name].js"
  },

  devtool: "cheap-module-source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["env"]
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      }
    ]
  },

  resolve: {
    extensions: [".js"]
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      DEBUG: false
    })
  ]
};
