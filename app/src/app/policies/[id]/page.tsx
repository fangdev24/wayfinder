import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPolicyById,
  getRelatedPolicies,
  getServiceById,
  getDepartmentById,
} from '@/lib/data';

interface PolicyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { id } = await params;
  const policy = getPolicyById(id);

  if (!policy) {
    return { title: 'Policy Not Found - Wayfinder' };
  }

  return {
    title: `${policy.name} - Wayfinder`,
    description: policy.description,
  };
}

const STATUS_COLOURS: Record<string, string> = {
  active: '#00703c',
  consultation: '#f47738',
  proposed: '#1d70b8',
  superseded: '#505a5f',
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { id } = await params;
  const policy = getPolicyById(id);

  if (!policy) {
    notFound();
  }

  const relatedPolicies = getRelatedPolicies(id);
  const leadDepartment = getDepartmentById(policy.leadDepartment);
  const affectedDepartments = policy.affectedDepartments
    .map((deptId) => getDepartmentById(deptId))
    .filter(Boolean);
  const relatedServices = policy.relatedServices
    .map((serviceId) => getServiceById(serviceId))
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
            <Link href="/policies" className="govuk-breadcrumbs__link">
              Policies
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {policy.name}
          </li>
        </ol>
      </nav>

      {/* Policy Header */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <span
            className="govuk-tag"
            style={{ background: STATUS_COLOURS[policy.status] || '#505a5f' }}
          >
            {policy.status}
          </span>
          <span className="govuk-tag govuk-tag--grey govuk-!-margin-left-2">
            {policy.category}
          </span>

          <h1 className="govuk-heading-xl govuk-!-margin-top-4">{policy.name}</h1>
          <p className="govuk-body-l">{policy.description}</p>
        </div>

        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{
              background: '#f3f2f1',
              borderLeft: `4px solid ${leadDepartment?.colour || '#6f72af'}`,
            }}
          >
            <h2 className="govuk-heading-s govuk-!-margin-bottom-2">Lead department</h2>
            <p className="govuk-body govuk-!-margin-bottom-0">
              <strong style={{ color: leadDepartment?.colour }}>
                {leadDepartment?.acronym}
              </strong>
              {' '}&ndash; {leadDepartment?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Policy Objectives */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Objectives</h2>
          <ul className="govuk-list govuk-list--bullet">
            {policy.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>

        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-s">Key dates</h2>
          <dl className="govuk-summary-list govuk-summary-list--no-border">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Effective</dt>
              <dd className="govuk-summary-list__value">{policy.effectiveDate}</dd>
            </div>
            {policy.reviewDate && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Review</dt>
                <dd className="govuk-summary-list__value">{policy.reviewDate}</dd>
              </div>
            )}
          </dl>
          {policy.legislationRef && (
            <>
              <h2 className="govuk-heading-s govuk-!-margin-top-4">Legislation</h2>
              <p className="govuk-body-s">
                <a href={policy.legislationRef} className="govuk-link" target="_blank" rel="noopener noreferrer">
                  View legislation
                </a>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Affected Departments */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-m">
            Affected departments ({affectedDepartments.length})
          </h2>
          <div className="govuk-grid-row">
            {affectedDepartments.map((dept) =>
              dept ? (
                <div key={dept.id} className="govuk-grid-column-one-third govuk-!-margin-bottom-4">
                  <div
                    className="govuk-!-padding-3"
                    style={{
                      borderLeft: `4px solid ${dept.colour}`,
                      background: '#f3f2f1',
                    }}
                  >
                    <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
                      <span style={{ color: dept.colour }}>{dept.acronym}</span>
                      {' '}&ndash; {dept.name}
                    </h3>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Related services ({relatedServices.length})
            </h2>
            <ul className="govuk-list govuk-list--bullet">
              {relatedServices.map((service) =>
                service ? (
                  <li key={service.id}>
                    <Link href={`/services/${service.id}`} className="govuk-link">
                      {service.name}
                    </Link>
                    <span className="govuk-body-s govuk-!-margin-left-2" style={{ color: '#505a5f' }}>
                      {service.departmentId.toUpperCase()}
                    </span>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Related Policies */}
      {relatedPolicies.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Related policies ({relatedPolicies.length})
            </h2>
            <ul className="govuk-list govuk-list--bullet">
              {relatedPolicies.map((relPolicy) => (
                <li key={relPolicy.id}>
                  <Link href={`/policies/${relPolicy.id}`} className="govuk-link">
                    {relPolicy.name}
                  </Link>
                  <span
                    className="govuk-tag govuk-!-margin-left-2"
                    style={{ background: STATUS_COLOURS[relPolicy.status] || '#505a5f' }}
                  >
                    {relPolicy.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tags */}
      {policy.tags.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-s">Tags</h2>
            <p className="govuk-body">
              {policy.tags.map((tag) => (
                <span key={tag} className="govuk-tag govuk-tag--grey govuk-!-margin-right-2 govuk-!-margin-bottom-2">
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
            href={`/graph?focus=${policy.id}`}
            className="govuk-button govuk-button--secondary"
          >
            View in knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
