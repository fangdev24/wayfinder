/**
 * Edit Service Page
 *
 * Form for editing an existing service.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServiceForm } from '@/components/admin/forms/ServiceForm';
import { getServiceById, getAllTeams, getAllDepartments } from '@/lib/admin/services';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const service = getServiceById(id);
  const teams = getAllTeams();
  const departments = getAllDepartments();

  if (!service) {
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
            <Link href="/admin/services" className="govuk-breadcrumbs__link">
              Services
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <Link href={`/admin/services/${service.id}`} className="govuk-breadcrumbs__link">
              {service.name}
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            Edit
          </li>
        </ol>
      </nav>

      <h1 className="govuk-heading-xl">Edit service</h1>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ServiceForm
            mode="edit"
            initialData={service}
            teams={teams}
            departments={departments}
          />
        </div>
      </div>
    </>
  );
}
