'use client';

import { useState } from 'react';
import type { PatternCategory } from '@/lib/data';

interface PatternFiltersProps {
  onFilterChange: (filters: PatternFilterState) => void;
}

export interface PatternFilterState {
  category: PatternCategory | '';
  search: string;
}

export function PatternFilters({ onFilterChange }: PatternFiltersProps) {
  const [filters, setFilters] = useState<PatternFilterState>({
    category: '',
    search: '',
  });

  const handleChange = (key: keyof PatternFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="govuk-!-margin-bottom-6">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="filter-category">
              Category
            </label>
            <select
              className="govuk-select"
              id="filter-category"
              value={filters.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">All categories</option>
              <option value="integration">Integration</option>
              <option value="security">Security</option>
              <option value="data">Data</option>
              <option value="resilience">Resilience</option>
              <option value="messaging">Messaging</option>
              <option value="identity">Identity</option>
            </select>
          </div>
        </div>

        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="pattern-search">
              Search
            </label>
            <input
              className="govuk-input"
              id="pattern-search"
              type="text"
              placeholder="Search patterns..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
