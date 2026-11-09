import React from 'react';
import { Search } from 'lucide-react';

export default function FilterTabs({ activeFilter, onFilterChange, searchQuery, onSearchChange }) {
  return (
    <div className="board-header">
      <div className="filter-tabs" role="tablist">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${activeFilter === 'open' ? 'active' : ''}`}
          onClick={() => onFilterChange('open')}
        >
          Open
        </button>
        <button
          className={`filter-btn ${activeFilter === 'done' ? 'active' : ''}`}
          onClick={() => onFilterChange('done')}
        >
          Done
        </button>
      </div>

      <div className="search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search slips..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
