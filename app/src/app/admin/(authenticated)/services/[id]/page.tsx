/**
 * Service Detail Page
 *
 * Displays service details with edit and delete options.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServiceById } from '@/lib/admin/services';
import { DeleteServiceButton } from '@/components/admin/DeleteServiceButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  const statusColours: Record<string, string> = {
    live: 'govuk-tag--green',
    beta: 'govuk-tag--blue',
    alpha: 'govuk-tag--yellow',
    deprecated: 'govuk-tag--orange',
    retired: 'govuk-tag--grey',
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <Link href="/admin" className="govuk-breadcrumbs__link">
              Admin
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <Link href="/admin/services" className="govuk-breadcrumbs__link">
              Services
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {service.name}
          </li>
        </ol>
      </nav>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">{service.name}</h1>
        </div>
        <div className="govuk-grid-column-one-third" style={{ textAlign: 'right' }}>
          <Link
            href={`/admin/services/${service.id}/edit`}
            className="govuk-button govuk-button--secondary"
            style={{ marginRight: '10px' }}
          >
            Edit
          </Link>
          <DeleteServiceButton serviceId={service.id} serviceName={service.name} />
        </div>
      </div>

      {/* Status */}
      <p className="govuk-body">
        <strong className={`govuk-tag ${statusColours[service.status]}`}>
          {service.status}
        </strong>
        <span className="govuk-hint" style={{ display: 'inline', marginLeft: '10px' }}>
          {service.type}
        </span>
      </p>

      {/* Description */}
      <h2 className="govuk-heading-m">Description</h2>
      <p className="govuk-body">{service.description}</p>

      {/* Details */}
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">ID</dt>
          <dd className="govuk-summary-list__value">
            <code>{service.id}</code>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Department</dt>
          <dd className="govuk-summary-list__value">{service.departmentName}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Team</dt>
          <dd className="govuk-summary-list__value">{service.teamName}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Documentation</dt>
          <dd className="govuk-summary-list__value">
            <a href={service.documentation} className="govuk-link" target="_blank" rel="noopener">
              {service.documentation}
            </a>
          </dd>
        </div>
        {service.endpoint && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Endpoint</dt>
            <dd className="govuk-summary-list__value">
              <code>{service.endpoint}</code>
            </dd>
          </div>
        )}
        {service.version && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Version</dt>
            <dd className="govuk-summary-list__value">{service.version}</dd>
          </div>
        )}
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Last Updated</dt>
          <dd className="govuk-summary-list__value">{service.lastUpdated}</dd>
        </div>
        {service.monthlyRequests && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Monthly Requests</dt>
            <dd className="govuk-summary-list__value">{service.monthlyRequests}</dd>
          </div>
        )}
        {service.uptime && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Uptime</dt>
            <dd className="govuk-summary-list__value">{service.uptime}</dd>
          </div>
        )}
      </dl>

      {/* Authentication */}
      {service.authentication.length > 0 && (
        <>
          <h2 className="govuk-heading-m">Authentication</h2>
          <ul className="govuk-list govuk-list--bullet">
            {service.authentication.map((auth) => (
              <li key={auth}>{auth}</li>
            ))}
          </ul>
        </>
      )}

      {/* Tags */}
      {service.tags.length > 0 && (
        <>
          <h2 className="govuk-heading-m">Tags</h2>
          <p className="govuk-body">
            {service.tags.map((tag) => (
              <strong key={tag} className="govuk-tag govuk-tag--grey" style={{ marginRight: '5px' }}>
                {tag}
              </strong>
            ))}
          </p>
        </>
      )}

      {/* Dependencies */}
      {service.dependencies.length > 0 && (
        <>
          <h2 className="govuk-heading-m">Dependencies</h2>
          <ul className="govuk-list govuk-list--bullet">
            {service.dependencies.map((dep) => (
              <li key={dep}>
                <Link href={`/admin/services/${dep}`} className="govuk-link">
                  {dep}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Back link */}
      <p className="govuk-body govuk-!-margin-top-6">
        <Link href="/admin/services" className="govuk-link">
          Back to services list
        </Link>
      </p>
    </>
  );
}
