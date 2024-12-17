const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const { log } = require("console");

const clientDir = path.join(__dirname, "");

module.exports = {
  mode: "development",
  entry: path.join(clientDir, "src", "index.tsx"),
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist/"),
    filename: "jhelper.js",
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx|jsx|ts|js)?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
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
    open: false,
    proxy: {
      "/login": {
        target: "http://localhost:9080/",
        changeOrigin: true,
        // cookieDomainRewrite: "",
        // cookiePathRewrite: "",
        onProxyReq: (proxyReq) => {
          console.log("====================");
          console.log(proxyReq);
          console.log("-------------------------");
          // proxyReq.setHeader("Cookie", cookie);
        },
        onProxyRes: (proxyRes) => {
          console.log("====================");
          console.log(proxyRes.headers);
          /*
          Object.keys(proxyRes.headers).forEach((key) => {
            if (key === "set-cookie" && proxyRes.headers[key]) {
              const cookieTokens = split(proxyRes.headers[key], ",");
              cookie = cookieTokens
                .filter((element) => element.includes("JSESSIONID"))
                .join("");
            }
          });*/
          console.log("-------------------------");
        },
      },
      "/api": {
        target: "http://localhost:9080/",
        changeOrigin: true,
        // cookieDomainRewrite: "",
        // cookiePathRewrite: "",
        onProxyReq: (proxyReq) => {
          console.log("====================");
          console.log(proxyReq);
          console.log("-------------------------");
          //  proxyReq.setHeader("Cookie", cookie);
        },
        onProxyRes: (proxyRes) => {
          console.log("====================");
          console.log(proxyRes.headers);
          /*
          Object.keys(proxyRes.headers).forEach((key) => {
            if (key === "set-cookie" && proxyRes.headers[key]) {
              const cookieTokens = split(proxyRes.headers[key], ",");
              cookie = cookieTokens
                .filter((element) => element.includes("JSESSIONID"))
                .join("");
            }
          });
          */
          console.log("-------------------------");
        },
      },
      "/vendor": {
        target: "http://localhost:9080/",
        changeOrigin: true,
        //cookieDomainRewrite: "",
        //cookiePathRewrite: "",
      },
    },
  },
};
