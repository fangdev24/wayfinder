import { patterns, stats } from '@/lib/data';
import { PatternList } from '@/components/PatternList';
import { PatternCard } from '@/components/cards/PatternCard';

export const metadata = {
  title: 'Pattern Library - Wayfinder',
  description: 'Learn from proven patterns for integration, security, and data sharing',
};

export default function PatternsPage() {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Pattern Library</h1>
          <p className="govuk-body-l">
            Proven patterns for solving common problems across government.
            Each pattern includes the problem it solves, the solution approach,
            trade-offs, and real implementations.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h2 className="govuk-heading-m">{stats.patterns} patterns</h2>
            <ul className="govuk-list govuk-list--bullet">
              <li>Integration: {stats.patternsByCategory.integration}</li>
              <li>Security: {stats.patternsByCategory.security}</li>
              <li>Data: {stats.patternsByCategory.data}</li>
              <li>Resilience: {stats.patternsByCategory.resilience}</li>
              <li>Messaging: {stats.patternsByCategory.messaging}</li>
              <li>Identity: {stats.patternsByCategory.identity}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <PatternList patterns={patterns} />
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-inset-text">
            <h3 className="govuk-heading-s">Patterns are collaborative</h3>
            <p className="govuk-body">
              These patterns were contributed by teams across multiple departments.
              Contributors are shown on each pattern - click through to see their
              profiles (fetched from their Solid Pods).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
