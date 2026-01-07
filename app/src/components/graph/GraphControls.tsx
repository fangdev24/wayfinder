'use client';

import { useState } from 'react';

/**
 * GraphControls - Filters and controls for the knowledge graph
 */
export function GraphControls() {
  const [showServices, setShowServices] = useState(true);
  const [showPatterns, setShowPatterns] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  return (
    <div className="govuk-!-margin-bottom-6">
      <h2 className="govuk-heading-s">Filter</h2>

      {/* Department Filter */}
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="department-filter">
          Department
        </label>
        <select
          className="govuk-select"
          id="department-filter"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">All departments</option>
          <option value="dso">Digital Standards Office</option>
          <option value="dcs">Citizen Support</option>
          <option value="rts">Revenue &amp; Taxation</option>
          <option value="bia">Border &amp; Identity</option>
          <option value="vla">Vehicle &amp; Licensing</option>
          <option value="nhds">Health Data Service</option>
        </select>
      </div>

      {/* Node Type Toggles */}
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            Show
          </legend>
          <div className="govuk-checkboxes govuk-checkboxes--small">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="show-services"
                type="checkbox"
                checked={showServices}
                onChange={(e) => setShowServices(e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor="show-services">
                Services
              </label>
            </div>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="show-patterns"
                type="checkbox"
                checked={showPatterns}
                onChange={(e) => setShowPatterns(e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor="show-patterns">
                Patterns
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        className="govuk-button govuk-button--secondary"
        onClick={() => {
          setShowServices(true);
          setShowPatterns(true);
          setSelectedDepartment('all');
        }}
      >
        Reset filters
      </button>
    </div>
  );
}
