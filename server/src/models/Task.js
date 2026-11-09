import mongoose from 'mongoose';
import { memoryStore, getDbStatus } from '../config/db.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    category: {
      type: String,
      trim: true,
      maxlength: [30, 'Category cannot exceed 30 characters'],
      default: ''
    },
    dueDate: {
      type: Date,
      default: null
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const MongooseTask = mongoose.model('Task', taskSchema);

// Hybrid model that uses Mongoose if connected, or memoryStore seamlessly
export const TaskRepository = {
  find: async (query = {}) => {
    if (getDbStatus()) {
      return await MongooseTask.find(query).sort({ createdAt: -1 });
    }
    return await memoryStore.find(query);
  },

  findById: async (id) => {
    if (getDbStatus()) {
      return await MongooseTask.findById(id);
    }
    return await memoryStore.findById(id);
  },

  create: async (data) => {
    if (getDbStatus()) {
      return await MongooseTask.create(data);
    }
    return await memoryStore.create(data);
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    if (getDbStatus()) {
      return await MongooseTask.findByIdAndUpdate(id, update, { new: true, runValidators: true, ...options });
    }
    return await memoryStore.findByIdAndUpdate(id, update, options);
  },

  findByIdAndDelete: async (id) => {
    if (getDbStatus()) {
      return await MongooseTask.findByIdAndDelete(id);
    }
    return await memoryStore.findByIdAndDelete(id);
  },

  deleteMany: async (filter = {}) => {
    if (getDbStatus()) {
      return await MongooseTask.deleteMany(filter);
    }
    return await memoryStore.deleteMany(filter);
  }
};

export default TaskRepository;
