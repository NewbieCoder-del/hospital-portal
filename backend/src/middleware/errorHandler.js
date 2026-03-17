const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "Route not found.",
    requestId: req.requestId
  });
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || (statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR");
  const message = error.expose ? error.message : error.message || "Internal server error.";

  console.error(
    JSON.stringify({
      level: "error",
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      code,
      message: error.message,
      stack: error.stack
    })
  );

  res.status(statusCode).json({
    code,
    message: statusCode >= 500 ? "Internal server error." : message,
    requestId: req.requestId
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
