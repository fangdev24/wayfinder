'use client';

import { Suspense } from 'react';
import { GraphProvider } from './GraphContext';
import { GraphCanvas } from './GraphCanvas';
import { GraphControls } from './GraphControls';
import { GraphLegend } from './GraphLegend';

/**
 * GraphPageContent - Client wrapper that provides filter context
 *
 * This wrapper enables shared state between GraphControls and GraphCanvas
 * via React Context. The parent page remains a Server Component.
 */
export function GraphPageContent() {
  return (
    <GraphProvider>
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
    </GraphProvider>
  );
}
