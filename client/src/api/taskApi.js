const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Normalized fetch client handling PRD Error Shape:
 * { success: false, error: { code: '...', message: '...' } }
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data?.error?.message || data?.message || 'Something went wrong';
      const errorCode = data?.error?.code || 'SERVER_ERROR';
      const error = new Error(errorMsg);
      error.code = errorCode;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error('Cannot connect to Inkpot server. Please make sure backend is running.');
      netError.code = 'NETWORK_ERROR';
      throw netError;
    }
    throw error;
  }
}

export const taskApi = {
  // GET /api/tasks?completed=true|false&q=search
  getTasks: async ({ completed, q } = {}) => {
    const params = new URLSearchParams();
    if (completed !== undefined && completed !== null) {
      params.append('completed', completed);
    }
    if (q && q.trim()) {
      params.append('q', q.trim());
    }
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await request(`/tasks${queryStr}`);
  },

  // GET /api/tasks/:id
  getTaskById: async (id) => {
    return await request(`/tasks/${id}`);
  },

  // POST /api/tasks
  createTask: async ({ title, description, category, dueDate }) => {
    return await request('/tasks', {
      method: 'POST',
      body: JSON.stringify({ title, description, category, dueDate }),
    });
  },

  // PUT /api/tasks/:id
  updateTask: async (id, updates) => {
    return await request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // PATCH /api/tasks/:id/toggle
  toggleTask: async (id) => {
    return await request(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // DELETE /api/tasks/:id
  deleteTask: async (id) => {
    return await request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // DELETE /api/tasks?completed=true
  clearCompletedTasks: async () => {
    return await request('/tasks?completed=true', {
      method: 'DELETE',
    });
  },
};
