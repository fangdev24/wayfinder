import { Suspense } from 'react';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { GraphControls } from '@/components/graph/GraphControls';
import { GraphLegend } from '@/components/graph/GraphLegend';

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
            Explore how services, APIs, patterns, and teams connect across government.
            Click nodes to see details, drag to pan, scroll to zoom.
          </p>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-one-quarter">
          <GraphControls />
          <GraphLegend />
        </div>

        <div className="govuk-grid-column-three-quarters">
          <Suspense
            fallback={
              <div className="wayfinder-graph" aria-busy="true">
                <p className="govuk-body govuk-!-padding-4">Loading graph...</p>
              </div>
            }
          >
            <GraphCanvas />
          </Suspense>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <details className="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                How to use the graph
              </span>
            </summary>
            <div className="govuk-details__text">
              <ul className="govuk-list govuk-list--bullet">
                <li>
                  <strong>Click a node</strong> to see its details and connections
                </li>
                <li>
                  <strong>Drag nodes</strong> to rearrange the layout
                </li>
                <li>
                  <strong>Scroll</strong> to zoom in and out
                </li>
                <li>
                  <strong>Use filters</strong> to show specific departments or service types
                </li>
                <li>
                  <strong>Click a person</strong> to fetch their profile from their Solid Pod
                </li>
              </ul>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
