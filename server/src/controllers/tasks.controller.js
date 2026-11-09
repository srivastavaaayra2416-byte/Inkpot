import Task from '../models/Task.js';

// GET /api/tasks (query: completed=true|false, q=text)
export const getTasks = async (req, res, next) => {
  try {
    const { completed, q } = req.query;
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const tasks = await Task.find(filter);
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task does not exist'
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const { title, description, category, dueDate } = req.body;

    const newTask = await Task.create({
      title,
      description,
      category,
      dueDate: dueDate || null
    });

    return res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, dueDate, completed } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task does not exist'
        }
      });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(dueDate !== undefined && { dueDate }),
        ...(completed !== undefined && { completed })
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/toggle
export const toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task does not exist'
        }
      });
    }

    const nextCompleted = !task.completed;
    const updated = await Task.findByIdAndUpdate(
      id,
      { completed: nextCompleted },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id OR DELETE /api/tasks?completed=true
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.query;

    // Clear all completed tasks if query string provided
    if (completed === 'true') {
      const result = await Task.deleteMany({ completed: true });
      return res.status(200).json({
        success: true,
        message: 'All completed tasks cleared',
        deletedCount: result.deletedCount
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Task ID is required'
        }
      });
    }

    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Task does not exist'
        }
      });
    }

    // PRD Section 6.3 specifies DELETE /api/tasks/:id returns 204
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
