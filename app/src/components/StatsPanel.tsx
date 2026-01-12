import { stats } from '@/lib/data';

export function StatsPanel() {
  return (
    <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
      <h2 className="govuk-heading-m">What&apos;s in Wayfinder</h2>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-margin-bottom-4">
            <span className="govuk-heading-xl govuk-!-margin-bottom-1">
              {stats.departments}
            </span>
            <span className="govuk-body">Departments</span>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-margin-bottom-4">
            <span className="govuk-heading-xl govuk-!-margin-bottom-1">
              {stats.services}
            </span>
            <span className="govuk-body">Services &amp; APIs</span>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-margin-bottom-4">
            <span className="govuk-heading-xl govuk-!-margin-bottom-1">
              {stats.patterns}
            </span>
            <span className="govuk-body">Patterns</span>
          </div>
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-margin-bottom-4">
            <span className="govuk-heading-xl govuk-!-margin-bottom-1">
              {stats.policies}
            </span>
            <span className="govuk-body">Policies</span>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-margin-bottom-4">
            <span className="govuk-heading-xl govuk-!-margin-bottom-1">
              {stats.agents}
            </span>
            <span className="govuk-body">AI Agents</span>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-margin-bottom-4">
            <span className="govuk-heading-xl govuk-!-margin-bottom-1">
              {stats.people}
            </span>
            <span className="govuk-body">
              People
              <span className="govuk-!-font-size-14 govuk-!-display-block">
                (from Solid Pods)
              </span>
            </span>
          </div>
        </div>
      </div>

      <p className="govuk-body-s govuk-!-margin-bottom-0">
        Demo data: All departments, services, and people shown are fictional.
      </p>
    </div>
  );
}
