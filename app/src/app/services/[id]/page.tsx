import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getServiceById,
  getDependencies,
  getConsumers,
  getTeamById,
  getPeopleByTeam,
  getPatternById,
} from '@/lib/data';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { PatternCard } from '@/components/cards/PatternCard';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    return { title: 'Service Not Found - Wayfinder' };
  }

  return {
    title: `${service.name} - Wayfinder`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  const dependencies = getDependencies(id);
  const consumers = getConsumers(id);
  const team = getTeamById(service.teamId);
  const maintainers = getPeopleByTeam(service.teamId);
  const patterns = service.relatedPatterns
    .map((pid) => getPatternById(pid))
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
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {service.name}
          </li>
        </ol>
      </nav>

      {/* Service Header */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <span className={`wayfinder-tag wayfinder-tag--${service.type}`}>
            {service.type}
          </span>
          <span className={`wayfinder-tag wayfinder-tag--${service.status} govuk-!-margin-left-2`}>
            {service.status}
          </span>

          <h1 className="govuk-heading-xl govuk-!-margin-top-4">{service.name}</h1>
          <p className="govuk-body-l">{service.description}</p>
        </div>
      </div>

      {/* Service Details */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <ServiceCard service={service} showFull />
        </div>

        <div className="govuk-grid-column-one-third">
          {/* Team & Maintainers */}
          <h2 className="govuk-heading-m">Maintained by</h2>
          {team && (
            <p className="govuk-body">
              <Link href={`/teams/${team.id}`} className="govuk-link">
                {team.name}
              </Link>
            </p>
          )}
          {maintainers.length > 0 && (
            <ul className="govuk-list">
              {maintainers.slice(0, 3).map((person) => (
                <li key={person.id}>
                  <PersonCard person={person} compact />
                </li>
              ))}
              {maintainers.length > 3 && (
                <li className="govuk-body-s">
                  +{maintainers.length - 3} more team members
                </li>
              )}
            </ul>
          )}

          {/* Quick Info */}
          <h2 className="govuk-heading-m govuk-!-margin-top-6">Quick info</h2>
          <dl className="govuk-summary-list govuk-summary-list--no-border">
            {service.endpoint && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Endpoint</dt>
                <dd className="govuk-summary-list__value">
                  <code className="govuk-!-font-size-14">{service.endpoint}</code>
                </dd>
              </div>
            )}
            {service.version && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Version</dt>
                <dd className="govuk-summary-list__value">{service.version}</dd>
              </div>
            )}
            {service.monthlyRequests && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Monthly requests</dt>
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
        </div>
      </div>

      {/* Dependencies & Consumers */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">Depends on ({dependencies.length})</h2>
          {dependencies.length > 0 ? (
            <ul className="govuk-list govuk-list--bullet">
              {dependencies.map((dep) => (
                <li key={dep.id}>
                  <Link href={`/services/${dep.id}`} className="govuk-link">
                    {dep.name}
                  </Link>
                  {dep.departmentId !== service.departmentId && (
                    <span className="wayfinder-relationship wayfinder-relationship--cross-department govuk-!-margin-left-2">
                      Cross-department
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="govuk-body govuk-!-colour-secondary">
              No dependencies
            </p>
          )}
        </div>

        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">Consumed by ({consumers.length})</h2>
          {consumers.length > 0 ? (
            <ul className="govuk-list govuk-list--bullet">
              {consumers.map((consumer) => (
                <li key={consumer.id}>
                  <Link href={`/services/${consumer.id}`} className="govuk-link">
                    {consumer.name}
                  </Link>
                  {consumer.departmentId !== service.departmentId && (
                    <span className="wayfinder-relationship wayfinder-relationship--cross-department govuk-!-margin-left-2">
                      Cross-department
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="govuk-body govuk-!-colour-secondary">
              No known consumers
            </p>
          )}
        </div>
      </div>

      {/* Related Patterns */}
      {patterns.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Related patterns ({patterns.length})
            </h2>
            <div className="wayfinder-grid wayfinder-grid--3-col">
              {patterns.map((pattern) =>
                pattern ? (
                  <PatternCard key={pattern.id} pattern={pattern} compact />
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <Link
            href={`/graph?focus=${service.id}`}
            className="govuk-button govuk-button--secondary"
          >
            View in knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
