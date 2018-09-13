const path = require("path");

const src = path.resolve(__dirname, "src");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  entry: {
    content: path.join(src, "content"),
    background: path.join(src, "background"),
    options: path.join(src, "options")
  },

  output: {
    path: dist,
    filename: "[name].js"
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  resolve: {
    extensions: [".js"]
  }
};
