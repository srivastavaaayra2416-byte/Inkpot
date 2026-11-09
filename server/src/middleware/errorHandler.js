// Central Error Handler as specified in PRD Section 6.4:
// { "success": false, "error": { "code": "VALIDATION_ERROR", "message": "..." } }

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.name || 'Error'}: ${err.message}`);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const firstKey = Object.keys(err.errors)[0];
    const message = err.errors[firstKey]?.message || 'Validation error';
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message
      }
    });
  }

  // CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid task identifier format'
      }
    });
  }

  // Custom App Error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'SERVER_ERROR',
        message: err.message
      }
    });
  }

  // Default 500
  return res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: 'An unexpected internal error occurred'
    }
  });
};
