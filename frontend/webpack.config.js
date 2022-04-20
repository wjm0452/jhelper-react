const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

const clientDir = path.join(__dirname, "");

module.exports = {
  mode: "production",
  entry: path.join(clientDir, "src", "index.tsx"),
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist/"),
    filename: "jhelper.js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [{
        test: /\.(ts|js)x?$/,
        use: [{
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        }, ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss|sass)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(clientDir, "public", "index.html"),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(clientDir, "public"),
    },
    compress: true,
    port: 8080,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
    client: {
      logging: "log",
      progress: true,
    },
    open: true,
    proxy: {
      "/api": "http://localhost:9080",
      "/vendor": "http://localhost:9080"
    },
  },
};