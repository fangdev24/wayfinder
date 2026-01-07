import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPersonByWebId, getServiceById, getTeamById } from '@/lib/data';
import { PersonProfile } from '@/components/solid/PersonProfile';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PodIndicator } from '@/components/solid/PodIndicator';

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
  const person = getPersonByWebId(decodedWebId);

  if (!person) {
    notFound();
  }

  const team = getTeamById(person.teamId);
  const maintainedServices = person.maintains
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
            {person.name}
          </li>
        </ol>
      </nav>

      {/* Pod Data Indicator - Key Demo Point */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <PodIndicator
            message={`This profile is fetched from ${person.name}'s personal Solid Pod, not our database`}
            webId={person.webId}
          />
        </div>
      </div>

      {/* Person Profile - Fetched from Solid Pod */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <PersonProfile webId={person.webId} fallbackData={person} />
        </div>

        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-s">Contact</h2>
          <p className="govuk-body">
            <a href={`mailto:${person.email}`} className="govuk-link">
              {person.email}
            </a>
          </p>

          {team && (
            <>
              <h2 className="govuk-heading-s govuk-!-margin-top-4">Team</h2>
              <p className="govuk-body">
                <Link href={`/teams/${team.id}`} className="govuk-link">
                  {team.name}
                </Link>
              </p>
              <p className="govuk-body">
                Slack: <code>{team.slack}</code>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Skills</h2>
          <ul className="govuk-list">
            {person.skills.map((skill) => (
              <li key={skill}>
                <span className="govuk-tag govuk-tag--grey govuk-!-margin-right-2 govuk-!-margin-bottom-2">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Services Maintained */}
      {maintainedServices.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Maintains ({maintainedServices.length} services)
            </h2>
            <div className="wayfinder-grid wayfinder-grid--2-col">
              {maintainedServices.map((service) =>
                service ? (
                  <ServiceCard key={service.id} service={service} compact />
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

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
                <code className="govuk-!-font-size-14">{person.webId}</code>
              </p>
              <p>
                In production, this would be hosted on{' '}
                <code>{person.departmentId.toUpperCase()}&apos;s Pod server</code>,
                giving the department full control over their staff data.
              </p>
              <p>
                <strong>Key point:</strong> {person.name} owns this data.
                They can update it, control who sees it, and revoke access -
                without asking Wayfinder.
              </p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
