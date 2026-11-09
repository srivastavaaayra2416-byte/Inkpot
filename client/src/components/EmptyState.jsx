import React from 'react';

export default function EmptyState({ filter }) {
  return (
    <div className="empty-state-card">
      <svg className="empty-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft paper stack illustration */}
        <rect x="22" y="24" width="56" height="66" rx="6" fill="#F0E5D3" transform="rotate(-6 50 50)" />
        <rect x="24" y="22" width="56" height="66" rx="6" fill="#FFFDF8" stroke="#E7DAC3" strokeWidth="2" />
        <path d="M34 38H68M34 48H62M34 58H52" stroke="#E7DAC3" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="52" cy="74" r="7" stroke="#F26B3A" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
      <h3 className="empty-title">
        {filter === 'done'
          ? 'No stamped slips yet'
          : filter === 'open'
          ? 'All caught up! The desk is clear.'
          : 'Your desk is completely clear'}
      </h3>
      <p className="empty-desc">
        {filter === 'all'
          ? 'Write down your first task slip above to get started.'
          : 'Take a sip of tea and relax!'}
      </p>
    </div>
  );
}
