/**
 * Services List Page
 *
 * Displays all services in a GOV.UK styled table with actions.
 */

import Link from 'next/link';
import { getAllServices } from '@/lib/admin/services';
import { SERVICE_STATUSES } from '@/lib/db/schema';

export default async function ServicesListPage() {
  const services = getAllServices();

  const statusColours: Record<string, string> = {
    live: 'govuk-tag--green',
    beta: 'govuk-tag--blue',
    alpha: 'govuk-tag--yellow',
    deprecated: 'govuk-tag--orange',
    retired: 'govuk-tag--grey',
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Services</h1>
          <p className="govuk-body-l">
            Manage the service catalogue. {services.length} services registered.
          </p>
        </div>
        <div className="govuk-grid-column-one-third" style={{ textAlign: 'right' }}>
          <Link
            href="/admin/services/new"
            className="govuk-button"
            data-module="govuk-button"
          >
            Add service
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            Filter by status
          </legend>
          <div className="govuk-checkboxes govuk-checkboxes--small govuk-checkboxes--inline">
            {SERVICE_STATUSES.map((status) => (
              <div className="govuk-checkboxes__item" key={status}>
                <span className={`govuk-tag ${statusColours[status]}`}>{status}</span>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Services table */}
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--m govuk-visually-hidden">
          Services
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              Name
            </th>
            <th scope="col" className="govuk-table__header">
              Team
            </th>
            <th scope="col" className="govuk-table__header">
              Department
            </th>
            <th scope="col" className="govuk-table__header">
              Type
            </th>
            <th scope="col" className="govuk-table__header">
              Status
            </th>
            <th scope="col" className="govuk-table__header">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {services.map((service) => (
            <tr key={service.id} className="govuk-table__row">
              <td className="govuk-table__cell">
                <Link
                  href={`/admin/services/${service.id}`}
                  className="govuk-link govuk-link--no-visited-state"
                >
                  {service.name}
                </Link>
              </td>
              <td className="govuk-table__cell">{service.teamName || service.teamId}</td>
              <td className="govuk-table__cell">
                {service.departmentName || service.departmentId}
              </td>
              <td className="govuk-table__cell">{service.type}</td>
              <td className="govuk-table__cell">
                <strong className={`govuk-tag ${statusColours[service.status]}`}>
                  {service.status}
                </strong>
              </td>
              <td className="govuk-table__cell">
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="govuk-link govuk-link--no-visited-state"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {services.length === 0 && (
        <p className="govuk-body govuk-hint">No services found.</p>
      )}
    </>
  );
}
