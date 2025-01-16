const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware(["/api", "/vendor"], {
      target: "http://localhost:9080",
      changeOrigin: true,
      logLevel: "debug",
    }),
  );
};
