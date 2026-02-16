import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getDataSharingAgreementById,
  getServiceById,
  getPolicyById,
  getDepartmentById,
} from '@/lib/data';
import { ServiceCard } from '@/components/cards/ServiceCard';

interface DataSharingAgreementPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DataSharingAgreementPageProps) {
  const { id } = await params;
  const agreement = getDataSharingAgreementById(id);

  if (!agreement) {
    return { title: 'Agreement Not Found - Wayfinder' };
  }

  return {
    title: `${agreement.name} - Wayfinder`,
    description: agreement.description,
  };
}

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

export default async function DataSharingAgreementPage({
  params,
}: DataSharingAgreementPageProps) {
  const { id } = await params;
  const agreement = getDataSharingAgreementById(id);

  if (!agreement) {
    notFound();
  }

  const provider = getDepartmentById(agreement.providingDepartmentId);
  const consumer = getDepartmentById(agreement.consumingDepartmentId);
  const relatedServices = agreement.relatedServices
    .map((serviceId) => getServiceById(serviceId))
    .filter(Boolean);
  const relatedPolicies = agreement.relatedPolicies
    .map((policyId) => getPolicyById(policyId))
    .filter(Boolean);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <Link href="/" className="govuk-breadcrumbs__link">
              Home
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <Link href="/data-sharing-agreements" className="govuk-breadcrumbs__link">
              Data Sharing Agreements
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {agreement.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span
              className="govuk-tag"
              style={{ background: STATUS_COLOURS[agreement.status] || '#505a5f' }}
            >
              {agreement.status}
            </span>
            <span className="govuk-tag govuk-tag--grey">
              {CATEGORY_LABELS[agreement.category] || agreement.category}
            </span>
          </div>

          <h1 className="govuk-heading-xl govuk-!-margin-bottom-4">{agreement.name}</h1>
          <p className="govuk-body-l">{agreement.description}</p>
        </div>

        <div className="govuk-grid-column-one-third">
          {/* Parties sidebar */}
          <div
            className="govuk-!-padding-4 govuk-!-margin-bottom-4"
            style={{
              background: '#f3f2f1',
              borderLeft: `4px solid ${provider?.colour || '#6f72af'}`,
            }}
          >
            <h2 className="govuk-heading-s govuk-!-margin-bottom-3">Parties</h2>

            <div className="govuk-!-margin-bottom-3">
              <p className="govuk-body-s govuk-!-margin-bottom-1">
                <strong>Data Provider</strong>
              </p>
              <p className="govuk-body govuk-!-margin-bottom-0">
                <span style={{ color: provider?.colour, fontWeight: 'bold' }}>
                  {provider?.acronym}
                </span>
                {' '}&ndash; {provider?.name}
              </p>
            </div>

            <div>
              <p className="govuk-body-s govuk-!-margin-bottom-1">
                <strong>Data Consumer</strong>
              </p>
              <p className="govuk-body govuk-!-margin-bottom-0">
                <span style={{ color: consumer?.colour, fontWeight: 'bold' }}>
                  {consumer?.acronym}
                </span>
                {' '}&ndash; {consumer?.name}
              </p>
            </div>
          </div>

          {/* Quick info sidebar */}
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1' }}
          >
            <h2 className="govuk-heading-s govuk-!-margin-bottom-3">Agreement Details</h2>

            <dl className="govuk-summary-list govuk-summary-list--no-border">
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Reference</dt>
                <dd className="govuk-summary-list__value">{agreement.reference}</dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Effective</dt>
                <dd className="govuk-summary-list__value">{agreement.effectiveDate}</dd>
              </div>
              {agreement.reviewDate && (
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Review</dt>
                  <dd className="govuk-summary-list__value">{agreement.reviewDate}</dd>
                </div>
              )}
              {agreement.expiryDate && (
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Expiry</dt>
                  <dd className="govuk-summary-list__value">{agreement.expiryDate}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Data Elements */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Data Elements</h2>
          <p className="govuk-body">
            The following data elements are shared under this agreement:
          </p>
          <ul className="govuk-list govuk-list--bullet">
            {agreement.dataElements.map((element) => (
              <li key={element}>
                <code className="govuk-!-font-size-16">{element}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Legal Basis */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Legal Basis</h2>
          <p className="govuk-body">{agreement.legalBasis}</p>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Implementing Services ({relatedServices.length})
            </h2>
            <p className="govuk-body">
              These services implement the data exchange defined by this agreement:
            </p>
            <div className="govuk-grid-row">
              {relatedServices.map((service) =>
                service ? (
                  <div
                    key={service.id}
                    className="govuk-grid-column-one-half govuk-!-margin-bottom-4"
                  >
                    <ServiceCard service={service} compact />
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Policies */}
      {relatedPolicies.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Governing Policies ({relatedPolicies.length})
            </h2>
            <p className="govuk-body">
              This agreement complies with the following policies:
            </p>
            <ul className="govuk-list govuk-list--bullet">
              {relatedPolicies.map((policy) =>
                policy ? (
                  <li key={policy.id}>
                    <Link href={`/policies/${policy.id}`} className="govuk-link">
                      {policy.name}
                    </Link>
                    <span
                      className="govuk-tag govuk-!-margin-left-2"
                      style={{
                        background:
                          policy.status === 'active'
                            ? '#00703c'
                            : policy.status === 'consultation'
                            ? '#f47738'
                            : '#505a5f',
                      }}
                    >
                      {policy.status}
                    </span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Tags */}
      {agreement.tags.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-s">Tags</h2>
            <p className="govuk-body">
              {agreement.tags.map((tag) => (
                <span
                  key={tag}
                  className="govuk-tag govuk-tag--grey govuk-!-margin-right-2 govuk-!-margin-bottom-2"
                >
                  {tag}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <Link
            href={`/graph?focus=${agreement.id}`}
            className="govuk-button govuk-button--secondary"
          >
            View in knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
