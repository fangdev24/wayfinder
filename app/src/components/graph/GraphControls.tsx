'use client';

import { useGraphFilters } from './GraphContext';

/**
 * GraphControls - Filters and layout controls for the knowledge graph
 *
 * Uses GraphContext to share filter/layout state with GraphCanvas
 */
export function GraphControls() {
  const {
    filters,
    layout,
    setShowServices,
    setShowPatterns,
    setShowPolicies,
    setShowAgents,
    setSelectedDepartment,
    setClumping,
    setSpacing,
    resetFilters,
    resetLayout,
  } = useGraphFilters();

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
          value={filters.selectedDepartment}
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
                checked={filters.showServices}
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
                checked={filters.showPatterns}
                onChange={(e) => setShowPatterns(e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor="show-patterns">
                Patterns
              </label>
            </div>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="show-policies"
                type="checkbox"
                checked={filters.showPolicies}
                onChange={(e) => setShowPolicies(e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor="show-policies">
                Policies
              </label>
            </div>
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="show-agents"
                type="checkbox"
                checked={filters.showAgents}
                onChange={(e) => setShowAgents(e.target.checked)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor="show-agents">
                Agents
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        className="govuk-button govuk-button--secondary"
        onClick={resetFilters}
      >
        Reset filters
      </button>

      {/* Layout Controls */}
      <h2 className="govuk-heading-s govuk-!-margin-top-6">Layout</h2>

      {/* Clumping Slider */}
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="clumping-slider">
          Clumping
        </label>
        <p id="clumping-hint" className="govuk-hint" style={{ fontSize: '14px', marginBottom: '8px' }}>
          Group similar nodes together
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#505a5f' }}>Loose</span>
          <input
            type="range"
            id="clumping-slider"
            min="0"
            max="100"
            value={layout.clumping}
            onChange={(e) => setClumping(parseInt(e.target.value, 10))}
            style={{ flex: 1, cursor: 'pointer' }}
            aria-describedby="clumping-hint"
          />
          <span style={{ fontSize: '12px', color: '#505a5f' }}>Tight</span>
        </div>
      </div>

      {/* Spacing Slider */}
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="spacing-slider">
          Spacing
        </label>
        <p id="spacing-hint" className="govuk-hint" style={{ fontSize: '14px', marginBottom: '8px' }}>
          Distance between clusters
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#505a5f' }}>Dense</span>
          <input
            type="range"
            id="spacing-slider"
            min="0"
            max="100"
            value={layout.spacing}
            onChange={(e) => setSpacing(parseInt(e.target.value, 10))}
            style={{ flex: 1, cursor: 'pointer' }}
            aria-describedby="spacing-hint"
          />
          <span style={{ fontSize: '12px', color: '#505a5f' }}>Spread</span>
        </div>
      </div>

      {/* Reset Layout Button */}
      <button
        type="button"
        className="govuk-button govuk-button--secondary"
        onClick={resetLayout}
      >
        Reset layout
      </button>
    </div>
  );
}
