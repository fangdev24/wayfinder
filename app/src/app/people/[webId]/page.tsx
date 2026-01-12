import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPersonByWebId, getServiceById, getTeamById } from '@/lib/data';
import { getExtendedPersonByWebId } from '@/data-source/people-extended';
import { PodIndicator } from '@/components/solid/PodIndicator';
import { PersonProfileWithAccess } from '@/components/solid/PersonProfileWithAccess';

interface PersonPageProps {
  params: Promise<{ webId: string }>;
}

export async function generateMetadata({ params }: PersonPageProps) {
  const { webId } = await params;
  const decodedWebId = decodeURIComponent(webId);
  const person = getPersonByWebId(decodedWebId);

  if (!person) {
    return { title: 'Person Not Found - Wayfinder' };
  }

  return {
    title: `${person.name} - Wayfinder`,
    description: `${person.role} at ${person.departmentId.toUpperCase()}`,
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { webId } = await params;
  const decodedWebId = decodeURIComponent(webId);
  const basePerson = getPersonByWebId(decodedWebId);

  if (!basePerson) {
    notFound();
  }

  // Get extended person data with protected fields
  const extendedPerson = getExtendedPersonByWebId(decodedWebId);
  if (!extendedPerson) {
    notFound();
  }

  const team = getTeamById(basePerson.teamId);
  const maintainedServices = basePerson.maintains
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
            <Link href="/services" className="govuk-breadcrumbs__link">
              Services
            </Link>
          </li>
          {team && (
            <li className="govuk-breadcrumbs__list-item">
              <Link href={`/teams/${team.id}`} className="govuk-breadcrumbs__link">
                {team.name}
              </Link>
            </li>
          )}
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {basePerson.name}
          </li>
        </ol>
      </nav>

      {/* Pod Data Indicator - Key Demo Point */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <PodIndicator
            message={`This profile is fetched from ${basePerson.name}'s personal Solid Pod with access-controlled fields`}
            webId={basePerson.webId}
          />
        </div>
      </div>

      {/* Person Profile with Access Control */}
      <PersonProfileWithAccess
        person={extendedPerson}
        team={team}
        maintainedServices={maintainedServices}
      />

      {/* WebID Info - For Demo */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <details className="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                About this profile data
              </span>
            </summary>
            <div className="govuk-details__text">
              <p>
                This profile data is fetched from a <strong>Solid Pod</strong>,
                not stored in Wayfinder&apos;s database.
              </p>
              <p>
                <strong>WebID:</strong>{' '}
                <code className="govuk-!-font-size-14">{basePerson.webId}</code>
              </p>
              <p>
                In production, this would be hosted on{' '}
                <code>{basePerson.departmentId.toUpperCase()}&apos;s Pod server</code>,
                giving the department full control over their staff data.
              </p>
              <p>
                <strong>Key point:</strong> {basePerson.name} owns this data.
                They can update it, control who sees it, and revoke access -
                without asking Wayfinder. The Pod automatically reveals more fields
                based on your verified identity attributes.
              </p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
