/**
 * Teams List Page
 *
 * Displays all teams in a GOV.UK styled table with actions.
 */

import Link from 'next/link';
import { getAllTeamsWithRelations } from '@/lib/admin/teams';

export default async function TeamsListPage() {
  const teams = getAllTeamsWithRelations();

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Teams</h1>
          <p className="govuk-body-l">
            Manage team ownership and responsibilities. {teams.length} teams registered.
          </p>
        </div>
        <div className="govuk-grid-column-one-third" style={{ textAlign: 'right' }}>
          <Link
            href="/admin/teams/new"
            className="govuk-button"
            data-module="govuk-button"
          >
            Add team
          </Link>
        </div>
      </div>

      {/* Teams table */}
      <table className="govuk-table">
        <caption className="govuk-table__caption govuk-table__caption--m govuk-visually-hidden">
          Teams
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              Name
            </th>
            <th scope="col" className="govuk-table__header">
              Department
            </th>
            <th scope="col" className="govuk-table__header">
              Services
            </th>
            <th scope="col" className="govuk-table__header">
              Contact
            </th>
            <th scope="col" className="govuk-table__header">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {teams.map((team) => (
            <tr key={team.id} className="govuk-table__row">
              <td className="govuk-table__cell">
                <Link
                  href={`/admin/teams/${team.id}`}
                  className="govuk-link govuk-link--no-visited-state"
                >
                  {team.name}
                </Link>
              </td>
              <td className="govuk-table__cell">{team.departmentName || team.departmentId}</td>
              <td className="govuk-table__cell">
                <strong className="govuk-tag govuk-tag--grey">{team.serviceCount}</strong>
              </td>
              <td className="govuk-table__cell">
                <a href={`mailto:${team.contact}`} className="govuk-link">
                  {team.contact}
                </a>
              </td>
              <td className="govuk-table__cell">
                <Link
                  href={`/admin/teams/${team.id}/edit`}
                  className="govuk-link govuk-link--no-visited-state"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {teams.length === 0 && (
        <p className="govuk-body govuk-hint">No teams found.</p>
      )}
    </>
  );
}
