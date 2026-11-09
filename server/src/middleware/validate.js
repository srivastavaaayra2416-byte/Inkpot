export const validateCreateTask = (req, res, next) => {
  const { title, description, category } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Title is required'
      }
    });
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 1 || trimmedTitle.length > 120) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Title must be between 1 and 120 characters'
      }
    });
  }

  if (description && typeof description === 'string' && description.trim().length > 500) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Description cannot exceed 500 characters'
      }
    });
  }

  if (category && typeof category === 'string' && category.trim().length > 30) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Category cannot exceed 30 characters'
      }
    });
  }

  next();
};

export const validateUpdateTask = (req, res, next) => {
  const { title, description, category } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title cannot be empty'
        }
      });
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 120) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Title must be between 1 and 120 characters'
        }
      });
    }
  }

  if (description !== undefined && typeof description === 'string' && description.trim().length > 500) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Description cannot exceed 500 characters'
      }
    });
  }

  if (category !== undefined && typeof category === 'string' && category.trim().length > 30) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Category cannot exceed 30 characters'
      }
    });
  }

  next();
};
