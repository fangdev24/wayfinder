import Link from 'next/link';
import type { Service } from '@/lib/data';

interface ServiceCardProps {
  service: Service;
  compact?: boolean;
  showFull?: boolean;
}

export function ServiceCard({ service, compact = false, showFull = false }: ServiceCardProps) {
  if (compact) {
    return (
      <div className={`wayfinder-card wayfinder-card--${service.departmentId}`}>
        <div className="wayfinder-card__header">
          <Link href={`/services/${service.id}`} className="govuk-link govuk-link--no-visited-state">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1">{service.name}</h3>
          </Link>
        </div>
        <p className="govuk-body-s govuk-!-margin-bottom-2">
          {service.description.slice(0, 100)}
          {service.description.length > 100 ? '...' : ''}
        </p>
        <div>
          <span className={`govuk-tag govuk-tag--grey govuk-!-font-size-14`}>
            {service.type}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`wayfinder-card wayfinder-card--${service.departmentId}`}>
      <div className="wayfinder-card__header">
        <div>
          <h2 className="wayfinder-card__title">
            <Link href={`/services/${service.id}`} className="govuk-link govuk-link--no-visited-state">
              {service.name}
            </Link>
          </h2>
          <p className="wayfinder-card__subtitle">{service.departmentId.toUpperCase()}</p>
        </div>
        <div>
          <span className={`govuk-tag wayfinder-tag--${service.type}`}>{service.type}</span>
        </div>
      </div>

      <div className="wayfinder-card__body">
        <p>{service.description}</p>

        {showFull && (
          <>
            {/* Authentication Methods */}
            {service.authentication && service.authentication.length > 0 && (
              <div className="govuk-!-margin-top-4">
                <h3 className="govuk-heading-s">Authentication</h3>
                <ul className="govuk-list">
                  {service.authentication.map((auth) => (
                    <li key={auth}>
                      <span className="govuk-tag govuk-tag--grey">{auth}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {service.tags.length > 0 && (
              <div className="govuk-!-margin-top-4">
                <h3 className="govuk-heading-s">Tags</h3>
                <ul className="govuk-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {service.tags.map((tag) => (
                    <li key={tag}>
                      <span className="govuk-tag govuk-tag--grey">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="wayfinder-card__footer">
        <span className={`govuk-tag wayfinder-tag--${service.status}`}>{service.status}</span>
        {service.documentation && (
          <Link
            href="/docs"
            className="govuk-link govuk-!-margin-left-4"
          >
            Documentation
          </Link>
        )}
      </div>
    </div>
  );
}
