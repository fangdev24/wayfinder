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
      </ul>

      {/* Edge Types */}
      <h3 className="govuk-heading-xs govuk-!-margin-top-4">Connections</h3>
      <ul className="govuk-list govuk-!-font-size-14">
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#0b0c0c' }}>―――</span> Depends on
        </li>
        <li className="govuk-!-margin-bottom-1">
          <span style={{ color: '#b1b4b6' }}>- - -</span> Implements pattern
        </li>
      </ul>
    </div>
  );
}
