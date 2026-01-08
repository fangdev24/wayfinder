/**
 * Edit Team Page
 *
 * Form for editing an existing team.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TeamForm } from '@/components/admin/forms/TeamForm';
import { getTeamById } from '@/lib/admin/teams';
import { getAllDepartments } from '@/lib/admin/services';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamPage({ params }: PageProps) {
  const { id } = await params;
  const team = getTeamById(id);
  const departments = getAllDepartments();

  if (!team) {
    notFound();
  }

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
          <li className="govuk-breadcrumbs__list-item">
            <Link href={`/admin/teams/${team.id}`} className="govuk-breadcrumbs__link">
              {team.name}
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            Edit
          </li>
        </ol>
      </nav>

      <h1 className="govuk-heading-xl">Edit team</h1>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <TeamForm mode="edit" initialData={team} departments={departments} />
        </div>
      </div>
    </>
  );
}
