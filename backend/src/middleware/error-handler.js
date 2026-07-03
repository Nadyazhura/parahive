export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  return res.status(err.statusCode ?? 500).json({
    error: {
      message: err.message ?? 'Internal server error',
    },
  });
}
