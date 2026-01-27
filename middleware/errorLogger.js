function errorLogger(err, req, res, next) {
  console.error(
    JSON.stringify(
      {
        time: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl,
        message: err.message
      },
      null,
      2
    )
  );

  next(err);
}

module.exports = errorLogger;
