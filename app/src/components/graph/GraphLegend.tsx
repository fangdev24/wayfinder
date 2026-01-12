/**
 * GraphLegend - Legend for the knowledge graph colors and shapes
 */
export function GraphLegend() {
  const departments = [
    { id: 'dso', name: 'Digital Standards', colour: '#00703c' },
    { id: 'dcs', name: 'Citizen Support', colour: '#1d70b8' },
    { id: 'rts', name: 'Revenue & Tax', colour: '#912b88' },
    { id: 'bia', name: 'Border & Identity', colour: '#d4351c' },
    { id: 'vla', name: 'Vehicle & Licensing', colour: '#f47738' },
    { id: 'nhds', name: 'Health Data', colour: '#005eb8' },
  ];

  return (
    <div className="govuk-!-margin-top-6">
      <h2 className="govuk-heading-s">Legend</h2>

      {/* Department Colours */}
      <h3 className="govuk-heading-xs">Departments</h3>
      <ul className="govuk-list govuk-!-font-size-14">
        {departments.map((dept) => (
          <li key={dept.id} className="govuk-!-margin-bottom-1">
            <span
              style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                backgroundColor: dept.colour,
                marginRight: '8px',
                borderRadius: '50%',
              }}
              aria-hidden="true"
            />
            {dept.name}
          </li>
        ))}
      </ul>

      {/* Node Shapes */}
      <h3 className="govuk-heading-xs govuk-!-margin-top-4">Node types</h3>
      <ul className="govuk-list govuk-!-font-size-14">
        <li className="govuk-!-margin-bottom-1">
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: '#1d70b8',
              marginRight: '8px',
              borderRadius: '50%',
            }}
            aria-hidden="true"
          />
          Service / API
        </li>
        <li className="govuk-!-margin-bottom-1">
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: '#505a5f',
              marginRight: '8px',
              transform: 'rotate(45deg)',
            }}
            aria-hidden="true"
          />
          Pattern
        </li>
        <li className="govuk-!-margin-bottom-1">
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            style={{ marginRight: '8px', verticalAlign: 'middle' }}
            aria-hidden="true"
          >
            <polygon
              points="7,0 13,3 13,9 7,12 1,9 1,3"
              fill="#6f72af"
              stroke="#0b0c0c"
              strokeWidth="0.5"
            />
          </svg>
          Policy
        </li>
        <li className="govuk-!-margin-bottom-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            style={{ marginRight: '8px', verticalAlign: 'middle' }}
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="12"
              height="12"
              rx="3"
              ry="3"
              fill="#0b0c0c"
              stroke="#0b0c0c"
              strokeWidth="0.5"
            />
          </svg>
          Agent
        </li>
      </ul>

      {/* Edge Types */}
      <h3 className="govuk-heading-xs govuk-!-margin-top-4">Connections</h3>
      <ul className="govuk-list govuk-!-font-size-14">
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#505a5f' }}>―――</span> Depends on
        </li>
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#0b7285' }}>―――</span> Agent consumes
        </li>
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#b1b4b6' }}>- - -</span> Implements pattern
        </li>
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#6f72af' }}>―――</span> Governs (policy)
        </li>
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#d4351c', fontWeight: 'bold' }}>―――</span> Cross-department
        </li>
      </ul>
    </div>
  );
}
