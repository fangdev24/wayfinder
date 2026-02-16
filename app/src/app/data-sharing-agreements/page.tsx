import Link from 'next/link';
import { dataSharingAgreements, getDepartmentById, stats } from '@/lib/data';
import { DataSharingAgreementCard } from '@/components/cards/DataSharingAgreementCard';

export const metadata = {
  title: 'Data Sharing Agreements - Wayfinder',
  description: 'Cross-government data sharing agreements in the Wayfinder knowledge base',
};

const STATUS_COLOURS: Record<string, string> = {
  active: '#00703c',
  draft: '#f47738',
  expired: '#d4351c',
  'under-review': '#1d70b8',
};

const CATEGORY_LABELS: Record<string, string> = {
  income: 'Income',
  identity: 'Identity',
  health: 'Health',
  benefits: 'Benefits',
  address: 'Address',
  employment: 'Employment',
  other: 'Other',
};

export default function DataSharingAgreementsPage() {
  // Group agreements by providing department
  const agreementsByProvider = dataSharingAgreements.reduce(
    (acc, agreement) => {
      const deptId = agreement.providingDepartmentId;
      if (!acc[deptId]) {
        acc[deptId] = [];
      }
      acc[deptId].push(agreement);
      return acc;
    },
    {} as Record<string, typeof dataSharingAgreements>
  );

  const providerDepts = Object.keys(agreementsByProvider).sort();

  // Count by status
  const statusCounts = {
    active: dataSharingAgreements.filter((d) => d.status === 'active').length,
    draft: dataSharingAgreements.filter((d) => d.status === 'draft').length,
    expired: dataSharingAgreements.filter((d) => d.status === 'expired').length,
    'under-review': dataSharingAgreements.filter((d) => d.status === 'under-review').length,
  };

  // Count by category
  const categoryCounts = Object.entries(stats.agreementsByCategory).filter(
    ([, count]) => count > 0
  );

  return (
    <>
      {/* Page Header */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Cross-Government</span>
          <h1 className="govuk-heading-xl">Data Sharing Agreements</h1>
          <p className="govuk-body-l">
            Formal arrangements enabling data sharing between government departments.
            These show the legal basis, data elements, and parties involved in
            cross-departmental data flows.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderLeft: '4px solid #6f72af' }}
          >
            <p className="govuk-body-s govuk-!-margin-bottom-2">
              <strong>{dataSharingAgreements.length} agreements</strong> across{' '}
              {providerDepts.length} data providers
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(statusCounts)
                .filter(([, count]) => count > 0)
                .map(([status, count]) => (
                  <span
                    key={status}
                    className="govuk-tag"
                    style={{ background: STATUS_COLOURS[status] || '#505a5f' }}
                  >
                    {status}: {count}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category summary */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <p className="govuk-body-s">
            <strong>Categories:</strong>{' '}
            {categoryCounts.map(([category, count], index) => (
              <span key={category}>
                {CATEGORY_LABELS[category] || category} ({count})
                {index < categoryCounts.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Agreements by Provider Department */}
      {providerDepts.map((deptId) => {
        const dept = getDepartmentById(deptId);
        const deptAgreements = agreementsByProvider[deptId];

        return (
          <div key={deptId} className="govuk-grid-row govuk-!-margin-top-8">
            <div className="govuk-grid-column-full">
              <h2
                className="govuk-heading-l"
                style={{ borderBottom: `4px solid ${dept?.colour || '#6f72af'}`, paddingBottom: '8px' }}
              >
                <span style={{ color: dept?.colour }}>{dept?.acronym}</span>
                {' '}&ndash; {dept?.name}
              </h2>
              <p className="govuk-body-s govuk-!-margin-bottom-4" style={{ color: '#505a5f' }}>
                {deptAgreements.length} agreement{deptAgreements.length !== 1 ? 's' : ''} where{' '}
                {dept?.acronym} provides data
              </p>

              <div className="govuk-grid-row">
                {deptAgreements.map((agreement) => (
                  <div
                    key={agreement.id}
                    className="govuk-grid-column-one-half govuk-!-margin-bottom-4"
                  >
                    <DataSharingAgreementCard agreement={agreement} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Explore relationships</h2>
          <p className="govuk-body">
            See how data sharing agreements connect departments, services, and policies
            in the knowledge graph.
          </p>
          <Link href="/graph" className="govuk-button">
            View knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
