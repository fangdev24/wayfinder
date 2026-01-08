/**
 * New Team Page
 *
 * Form for creating a new team.
 */

import Link from 'next/link';
import { TeamForm } from '@/components/admin/forms/TeamForm';
import { getAllDepartments } from '@/lib/admin/services';

export default async function NewTeamPage() {
  const departments = getAllDepartments();

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
            New team
          </li>
        </ol>
      </nav>

      <h1 className="govuk-heading-xl">Add a new team</h1>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <TeamForm mode="create" departments={departments} />
        </div>
      </div>
    </>
  );
}
