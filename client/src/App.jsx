import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Feather, RefreshCw } from 'lucide-react';
import { taskApi } from './api/taskApi';
import ProgressRing from './components/ProgressRing';
import TaskComposer from './components/TaskComposer';
import FilterTabs from './components/FilterTabs';
import TaskSlip from './components/TaskSlip';
import EmptyState from './components/EmptyState';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'done'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // { message, undoAction, isError }
  const [backendError, setBackendError] = useState(null);

  const undoTimeoutRef = useRef(null);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setBackendError(null);
      const res = await taskApi.getTasks();
      if (res.success) {
        setTasks(res.data);
      }
    } catch (err) {
      console.error(err);
      setBackendError(err.message || 'Unable to connect to server');
      showToast(err.message || 'Error fetching tasks', null, true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Toast with auto-dismiss and optional undo
  const showToast = (message, undoAction = null, isError = false) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setToast({ message, undoAction, isError });
    undoTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Add Task
  const handleAddTask = async (taskData) => {
    try {
      const res = await taskApi.createTask(taskData);
      if (res.success) {
        setTasks((prev) => [res.data, ...prev]);
        showToast('Task slip added to the desk!');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add task', null, true);
      throw err;
    }
  };

  // Toggle Task Completion with Optimistic Update + Paper Scrap Confetti
  const handleToggleTask = async (id) => {
    const prevTasks = [...tasks];
    const target = tasks.find((t) => t._id === id);
    if (!target) return;

    const willBeDone = !target.completed;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: willBeDone } : t))
    );

    // If all tasks are now completed or marking as done, trigger subtle paper scrap confetti
    if (willBeDone) {
      const remainingOpen = prevTasks.filter((t) => t._id !== id && !t.completed).length;
      if (remainingOpen === 0) {
        // Confetti of small paper scraps (PRD Section 5.6)
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FFD966', '#F2A1A1', '#A8D8F0', '#7C83E8', '#F26B3A']
        });
      }
    }

    try {
      await taskApi.toggleTask(id);
      showToast(willBeDone ? 'Stamped as DONE!' : 'Slip marked as open');
    } catch (err) {
      // Rollback on failure (PRD Section 6.5)
      setTasks(prevTasks);
      showToast(err.message || 'Failed to toggle status', null, true);
    }
  };

  // Update Task Inline
  const handleUpdateTask = async (id, updates) => {
    const prevTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updates } : t))
    );

    try {
      await taskApi.updateTask(id, updates);
      showToast('Slip updated!');
    } catch (err) {
      setTasks(prevTasks);
      showToast(err.message || 'Failed to update slip', null, true);
    }
  };

  // Delete Task with 5-second Undo Window (PRD Section 4.1 F4)
  const handleDeleteTask = async (taskToDelete) => {
    const prevTasks = [...tasks];
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));

    let undone = false;

    showToast('Torn off slip', () => {
      undone = true;
      setTasks(prevTasks);
      showToast('Restored slip');
    });

    // Wait 5 seconds before permanently deleting from server
    setTimeout(async () => {
      if (!undone) {
        try {
          await taskApi.deleteTask(taskToDelete._id);
        } catch (err) {
          console.error('Delete failed:', err);
          setTasks(prevTasks);
          showToast('Failed to delete on server', null, true);
        }
      }
    }, 5000);
  };

  // Clear All Completed
  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    if (!window.confirm(`Clear all ${completedTasks.length} completed slips?`)) return;

    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => !t.completed));

    try {
      await taskApi.clearCompletedTasks();
      showToast('Cleared completed slips');
    } catch (err) {
      setTasks(prevTasks);
      showToast('Failed to clear completed slips', null, true);
    }
  };

  // Calculations
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const openCount = totalCount - completedCount;

  // Filter & Search Logic
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'open' && t.completed) return false;
    if (filter === 'done' && !t.completed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTag = t.category?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchTag;
    }
    return true;
  });

  return (
    <div className="inkpot-app">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="ink-icon">
            <Feather />
          </div>
          <div className="brand-text">
            <h1 className="squiggle-underline">Inkpot</h1>
            <p className="brand-tagline">a tactile paper desk for your daily tasks</p>
          </div>
        </div>

        <ProgressRing completed={completedCount} total={totalCount} />
      </header>

      {/* Backend Error Banner with Retry */}
      {backendError && (
        <div style={{
          background: 'rgba(242, 107, 58, 0.12)',
          border: '1.5px solid var(--primary-accent)',
          padding: '0.8rem 1.2rem',
          borderRadius: 12,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>⚠️ {backendError}</span>
          <button
            onClick={loadTasks}
            style={{
              background: 'var(--primary-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Composer Input Slip */}
      <TaskComposer onAddTask={handleAddTask} />

      {/* Filters and Search */}
      <FilterTabs
        activeFilter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Slips Board */}
      {filteredTasks.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="tasks-board">
          {filteredTasks.map((task, index) => (
            <TaskSlip
              key={task._id}
              task={task}
              index={index}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-counts">
          <span className="count-badge">
            <span className="badge-dot open"></span>
            <strong>{openCount}</strong> open
          </span>
          <span className="count-badge">
            <span className="badge-dot done"></span>
            <strong>{completedCount}</strong> done
          </span>
        </div>

        {completedCount > 0 && (
          <button className="btn-clear-completed" onClick={handleClearCompleted}>
            Clear {completedCount} completed
          </button>
        )}
      </footer>

      {/* Floating Toast Notification with Undo */}
      {toast && (
        <div className="toast-container">
          <div className="inkpot-toast" style={toast.isError ? { background: '#D93829' } : {}}>
            <span>{toast.message}</span>
            {toast.undoAction && (
              <button className="toast-undo-btn" onClick={toast.undoAction}>
                UNDO
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
