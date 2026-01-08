/**
 * New Service Page
 *
 * Form for creating a new service.
 */

import Link from 'next/link';
import { ServiceForm } from '@/components/admin/forms/ServiceForm';
import { getAllTeams, getAllDepartments } from '@/lib/admin/services';

export default async function NewServicePage() {
  const teams = getAllTeams();
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
            <Link href="/admin/services" className="govuk-breadcrumbs__link">
              Services
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            New service
          </li>
        </ol>
      </nav>

      <h1 className="govuk-heading-xl">Add a new service</h1>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ServiceForm mode="create" teams={teams} departments={departments} />
        </div>
      </div>
    </>
  );
}
