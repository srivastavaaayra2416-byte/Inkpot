import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTask,
  deleteTask
} from '../controllers/tasks.controller.js';
import { validateCreateTask, validateUpdateTask } from '../middleware/validate.js';

const router = express.Router();

router.route('/')
  .get(getTasks)
  .post(validateCreateTask, createTask)
  .delete(deleteTask); // Supports /api/tasks?completed=true

router.route('/:id')
  .get(getTaskById)
  .put(validateUpdateTask, updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTask);

export default router;
