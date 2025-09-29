const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error('🚨 Async Handler Error:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      path: req.path,
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      body: req.body
    });
    next(err);
  });
};

module.exports = asyncHandler;

