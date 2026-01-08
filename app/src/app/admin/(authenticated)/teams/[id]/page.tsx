/**
 * Team Detail Page
 *
 * Displays team details with edit and delete options.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTeamById, getTeamServices } from '@/lib/admin/teams';
import { DeleteTeamButton } from '@/components/admin/DeleteTeamButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamDetailPage({ params }: PageProps) {
  const { id } = await params;
  const team = getTeamById(id);

  if (!team) {
    notFound();
  }

  const teamServices = getTeamServices(id);

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
            <Link href="/admin/teams" className="govuk-breadcrumbs__link">
              Teams
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {team.name}
          </li>
        </ol>
      </nav>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">{team.name}</h1>
        </div>
        <div className="govuk-grid-column-one-third" style={{ textAlign: 'right' }}>
          <Link
            href={`/admin/teams/${team.id}/edit`}
            className="govuk-button govuk-button--secondary"
            style={{ marginRight: '10px' }}
          >
            Edit
          </Link>
          <DeleteTeamButton teamId={team.id} teamName={team.name} hasServices={team.serviceCount > 0} />
        </div>
      </div>

      {/* Description */}
      <h2 className="govuk-heading-m">Description</h2>
      <p className="govuk-body">{team.description}</p>

      {/* Details */}
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">ID</dt>
          <dd className="govuk-summary-list__value">
            <code>{team.id}</code>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Department</dt>
          <dd className="govuk-summary-list__value">{team.departmentName}</dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Contact email</dt>
          <dd className="govuk-summary-list__value">
            <a href={`mailto:${team.contact}`} className="govuk-link">
              {team.contact}
            </a>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Slack channel</dt>
          <dd className="govuk-summary-list__value">{team.slack}</dd>
        </div>
      </dl>

      {/* Responsibilities */}
      {team.responsibilities.length > 0 && (
        <>
          <h2 className="govuk-heading-m">Responsibilities</h2>
          <ul className="govuk-list govuk-list--bullet">
            {team.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </>
      )}

      {/* Services */}
      <h2 className="govuk-heading-m">Services ({teamServices.length})</h2>
      {teamServices.length > 0 ? (
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">Name</th>
              <th scope="col" className="govuk-table__header">Type</th>
              <th scope="col" className="govuk-table__header">Status</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {teamServices.map((service) => (
              <tr key={service.id} className="govuk-table__row">
                <td className="govuk-table__cell">
                  <Link href={`/admin/services/${service.id}`} className="govuk-link">
                    {service.name}
                  </Link>
                </td>
                <td className="govuk-table__cell">{service.type}</td>
                <td className="govuk-table__cell">
                  <strong className="govuk-tag govuk-tag--grey">{service.status}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="govuk-body govuk-hint">No services assigned to this team.</p>
      )}

      {/* Back link */}
      <p className="govuk-body govuk-!-margin-top-6">
        <Link href="/admin/teams" className="govuk-link">
          Back to teams list
        </Link>
      </p>
    </>
  );
}
