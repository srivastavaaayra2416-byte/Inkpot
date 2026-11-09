import React, { useState } from 'react';
import { Pencil, Trash2, Check, X, Calendar } from 'lucide-react';

const TINT_CLASSES = ['tint-butter', 'tint-rose', 'tint-sky', 'tint-periwinkle'];
const ROT_CLASSES = ['rot-neg-1', 'rot-neg-2', 'rot-zero', 'rot-pos-1', 'rot-pos-2'];

export default function TaskSlip({ task, index, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [isCrumpling, setIsCrumpling] = useState(false);

  // Deterministic styling based on index
  const tintClass = TINT_CLASSES[index % TINT_CLASSES.length];
  const rotClass = ROT_CLASSES[index % ROT_CLASSES.length];

  const handleToggle = () => {
    onToggle(task._id);
  };

  const handleDeleteClick = () => {
    // Animate crumple then trigger delete callback
    setIsCrumpling(true);
    setTimeout(() => {
      onDelete(task);
    }, 200);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    await onUpdate(task._id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
      setEditDesc(task.description || '');
    }
  };

  const formattedDueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  }) : null;

  return (
    <div
      className={`task-slip ${tintClass} ${rotClass} ${task.completed ? 'completed' : ''} ${isCrumpling ? 'crumple-out' : ''}`}
      onKeyDown={handleKeyDown}
    >
      <div className="slip-pin" />

      {isEditing ? (
        <form onSubmit={handleSaveEdit} className="inline-edit-form">
          <input
            type="text"
            className="inline-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={120}
            required
            autoFocus
          />
          <textarea
            className="inline-edit-textarea"
            rows="2"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            maxLength={500}
            placeholder="Edit notes..."
          />
          <div className="inline-actions">
            <button type="submit" className="icon-btn" title="Save">
              <Check size={18} color="var(--primary-accent)" />
            </button>
            <button type="button" className="icon-btn" onClick={() => setIsEditing(false)} title="Cancel (Esc)">
              <X size={18} />
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="slip-header">
            <div className="slip-title-row">
              <button
                type="button"
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={handleToggle}
                aria-label={task.completed ? 'Mark task as open' : 'Mark task as completed'}
                title={task.completed ? 'Mark task as open' : 'Mark task as completed'}
              >
                {task.completed && <Check size={14} strokeWidth={3} />}
              </button>
              <h3 className="slip-title" onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {task.title}
              </h3>
            </div>
            <button
              onClick={handleToggle}
              className={`stamp-btn ${task.completed ? 'is-done' : ''}`}
              title={task.completed ? 'Mark task as open' : 'Stamp task as DONE'}
            >
              {task.completed ? '↩ Undo' : '✓ Mark Done'}
            </button>
          </div>

          {task.description && (
            <p className="slip-desc">{task.description}</p>
          )}

          {/* Rubber DONE Stamp if completed */}
          {task.completed && (
            <div className="done-stamp" onClick={handleToggle} style={{ cursor: 'pointer' }} title="Click to undo">
              DONE
            </div>
          )}

          <div className="slip-footer">
            <div className="slip-tags">
              {task.category && (
                <span className="category-tag">#{task.category}</span>
              )}
              {formattedDueDate && (
                <span className="due-date-tag" title="Due Date">
                  <Calendar size={12} style={{ display: 'inline', marginRight: 3 }} />
                  {formattedDueDate}
                </span>
              )}
            </div>

            <div className="slip-actions">
              <button
                className="icon-btn"
                onClick={() => setIsEditing(true)}
                title="Edit slip (inline)"
              >
                <Pencil size={15} />
              </button>
              <button
                className="icon-btn delete"
                onClick={handleDeleteClick}
                title="Tear off slip"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
