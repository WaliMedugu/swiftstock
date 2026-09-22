// Request Logger Middleware (Taught in class)
export const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const time = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${time}] ${method} ${url} - Status: ${res.statusCode} (${duration}ms)`);
  });

  next();
};
