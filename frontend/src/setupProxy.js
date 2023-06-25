const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware(["/login", "/api"], {
      target: "http://localhost:9080",
      changeOrigin: true
    })
  );
};
