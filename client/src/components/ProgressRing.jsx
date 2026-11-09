import React from 'react';

export default function ProgressRing({ completed, total }) {
  const size = 48;
  const strokeWidth = 4.5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container" title={`${completed} of ${total} tasks finished`}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle
          className="progress-ring-circle-bg"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>
      <div className="progress-text">
        <span>{percentage}%</span>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {completed}/{total}
        </div>
      </div>
    </div>
  );
}
