import React, { useState, useEffect } from 'react';
import { Feather, Plus } from 'lucide-react';

const PLACEHOLDERS = [
  'Water the plants...',
  'Finish the Android Club task...',
  'Draft the project proposal...',
  'Read chapter 4 of operating systems...',
  'Pick up loose tea leaves...'
];

export default function TaskComposer({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rotating placeholder as specified in PRD Section 5.6
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        dueDate: dueDate || null
      });

      setTitle('');
      setDescription('');
      setCategory('');
      setDueDate('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="composer-card">
      <form onSubmit={handleSubmit} className="composer-form">
        <div className="composer-main-row">
          <input
            type="text"
            className="composer-input"
            placeholder={PLACEHOLDERS[placeholderIndex]}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
            autoFocus
          />
          <button type="submit" className="btn-add" disabled={!title.trim() || isSubmitting}>
            <Plus size={18} />
            <span>{isSubmitting ? 'Inking...' : 'Add Slip'}</span>
          </button>
        </div>

        <div className="composer-extra-row">
          <input
            type="text"
            className="composer-sub-input flex-1"
            placeholder="Add details, notes or steps (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <input
            type="text"
            className="composer-sub-input flex-sm"
            placeholder="Tag (e.g. College)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={30}
          />
          <input
            type="date"
            className="composer-sub-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
