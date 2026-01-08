import Link from 'next/link';
import { policies, getDepartmentById } from '@/lib/data';

export const metadata = {
  title: 'Policies - Wayfinder',
  description: 'Cross-government policies in the Wayfinder knowledge base',
};

const STATUS_COLOURS: Record<string, string> = {
  active: '#00703c',
  consultation: '#f47738',
  proposed: '#1d70b8',
  superseded: '#505a5f',
};

const CATEGORY_LABELS: Record<string, string> = {
  digital: 'Digital',
  data: 'Data',
  security: 'Security',
  identity: 'Identity',
  environment: 'Environment',
  welfare: 'Welfare',
};

export default function PoliciesPage() {
  // Group policies by category
  const policiesByCategory = policies.reduce(
    (acc, policy) => {
      const category = policy.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(policy);
      return acc;
    },
    {} as Record<string, typeof policies>
  );

  const categories = Object.keys(policiesByCategory).sort();

  return (
    <>
      {/* Page Header */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Cross-Government</span>
          <h1 className="govuk-heading-xl">Policies</h1>
          <p className="govuk-body-l">
            Cross-cutting policies that span multiple government departments.
            These demonstrate how Wayfinder can show policy interdependencies
            alongside technical documentation.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderLeft: '4px solid #6f72af' }}
          >
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>{policies.length} policies</strong> across{' '}
              {categories.length} categories
            </p>
          </div>
        </div>
      </div>

      {/* Policies by Category */}
      {categories.map((category) => (
        <div key={category} className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-l">
              {CATEGORY_LABELS[category] || category}
            </h2>

            <div className="govuk-grid-row">
              {policiesByCategory[category].map((policy) => {
                const leadDept = getDepartmentById(policy.leadDepartment);
                return (
                  <div
                    key={policy.id}
                    className="govuk-grid-column-one-half govuk-!-margin-bottom-4"
                  >
                    <div
                      className="govuk-!-padding-4"
                      style={{
                        background: '#f3f2f1',
                        borderLeft: `4px solid ${leadDept?.colour || '#6f72af'}`,
                        minHeight: '200px',
                      }}
                    >
                      <span
                        className="govuk-tag"
                        style={{
                          background: STATUS_COLOURS[policy.status] || '#505a5f',
                        }}
                      >
                        {policy.status}
                      </span>

                      <h3 className="govuk-heading-s govuk-!-margin-top-2">
                        <Link href={`/policies/${policy.id}`} className="govuk-link">
                          {policy.name}
                        </Link>
                      </h3>

                      <p className="govuk-body-s">
                        {policy.description.substring(0, 150)}
                        {policy.description.length > 150 ? '...' : ''}
                      </p>

                      <p className="govuk-body-s govuk-!-margin-bottom-0">
                        <strong>Lead:</strong>{' '}
                        <span style={{ color: leadDept?.colour }}>
                          {leadDept?.acronym}
                        </span>
                        {' '}&bull;{' '}
                        <strong>Affects:</strong>{' '}
                        {policy.affectedDepartments.length} departments
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Explore relationships</h2>
          <p className="govuk-body">
            See how policies connect to services and each other in the knowledge graph.
          </p>
          <Link href="/graph" className="govuk-button">
            View knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
