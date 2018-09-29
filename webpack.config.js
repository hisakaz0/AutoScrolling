const path = require("path");

const src = path.resolve(__dirname, "src");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  entry: {
    content: path.join(src, "scripts/content"),
    background: path.join(src, "scripts/background"),
    options: path.join(src, "scripts/options")
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
          presets: ["env"]
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      }
    ]
  },

  resolve: {
    extensions: [".js"]
  }
};
