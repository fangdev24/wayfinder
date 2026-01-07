'use client';

import { useState } from 'react';
import { departments } from '@/lib/data';
import type { ServiceType, ServiceStatus } from '@/lib/data';

interface ServiceFiltersProps {
  onFilterChange: (filters: ServiceFilterState) => void;
}

export interface ServiceFilterState {
  department: string;
  type: ServiceType | '';
  status: ServiceStatus | '';
  search: string;
}

export function ServiceFilters({ onFilterChange }: ServiceFiltersProps) {
  const [filters, setFilters] = useState<ServiceFilterState>({
    department: '',
    type: '',
    status: '',
    search: '',
  });

  const handleChange = (key: keyof ServiceFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="govuk-!-margin-bottom-6">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="filter-department">
              Department
            </label>
            <select
              className="govuk-select"
              id="filter-department"
              value={filters.department}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="">All departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.acronym}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="govuk-grid-column-one-quarter">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="filter-type">
              Type
            </label>
            <select
              className="govuk-select"
              id="filter-type"
              value={filters.type}
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <option value="">All types</option>
              <option value="api">API</option>
              <option value="platform">Platform</option>
              <option value="library">Library</option>
              <option value="event-stream">Event Stream</option>
              <option value="batch-service">Batch Service</option>
              <option value="ui-component">UI Component</option>
            </select>
          </div>
        </div>

        <div className="govuk-grid-column-one-quarter">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="filter-status">
              Status
            </label>
            <select
              className="govuk-select"
              id="filter-status"
              value={filters.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="live">Live</option>
              <option value="beta">Beta</option>
              <option value="alpha">Alpha</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
        </div>

        <div className="govuk-grid-column-one-quarter">
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="filter-search">
              Search
            </label>
            <input
              className="govuk-input"
              id="filter-search"
              type="text"
              placeholder="Search services..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
