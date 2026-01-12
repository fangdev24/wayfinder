import { GraphPageContent } from '@/components/graph/GraphPageContent';

export const metadata = {
  title: 'Knowledge Graph - Wayfinder',
  description: 'Explore how services, APIs, and teams connect across government',
};

export default function GraphPage() {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h1 className="govuk-heading-xl">Knowledge Graph</h1>
          <p className="govuk-body-l">
            Explore how services, APIs, patterns, policies, and AI agents connect across government.
            Click nodes to see details, drag to pan, scroll to zoom.
          </p>
        </div>
      </div>

      {/* Understanding the Graph - Collapsible, above the graph */}
      <div className="govuk-grid-row govuk-!-margin-bottom-4">
        <div className="govuk-grid-column-full">
          <details className="govuk-details" open>
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                Understanding the graph
              </span>
            </summary>
            <div className="govuk-details__text">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                  <p className="govuk-body-s govuk-!-margin-bottom-2"><strong>Nodes:</strong></p>
                  <ul className="govuk-list govuk-list--bullet govuk-!-font-size-14">
                    <li><strong>Circles</strong> (coloured) - Services &amp; APIs</li>
                    <li><strong>Diamonds</strong> (grey) - Design patterns</li>
                    <li><strong>Hexagons</strong> (purple) - Policies</li>
                    <li><strong>Squares</strong> (black) - AI agents</li>
                  </ul>
                </div>
                <div className="govuk-grid-column-one-half">
                  <p className="govuk-body-s govuk-!-margin-bottom-2"><strong>Connections:</strong></p>
                  <ul className="govuk-list govuk-list--bullet govuk-!-font-size-14">
                    <li><span style={{ color: '#505a5f' }}>Grey</span> - Service depends on service</li>
                    <li><span style={{ color: '#0b7285' }}>Teal</span> - Agent consumes service</li>
                    <li><span style={{ color: '#b1b4b6' }}>Dashed</span> - Implements pattern</li>
                    <li><span style={{ color: '#6f72af' }}>Purple</span> - Policy governs</li>
                    <li><span style={{ color: '#d4351c', fontWeight: 'bold' }}>Red</span> - Cross-department</li>
                  </ul>
                </div>
              </div>
              <p className="govuk-body-s govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                <strong>Tip:</strong> Use Clumping to group by department, Spacing to spread clusters. Double-click nodes for details.
              </p>
            </div>
          </details>
        </div>
      </div>

      <GraphPageContent />
    </>
  );
}
