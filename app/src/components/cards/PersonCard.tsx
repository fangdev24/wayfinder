import Link from 'next/link';
import type { Person } from '@/lib/data';

interface PersonCardProps {
  person: Person;
  compact?: boolean;
}

export function PersonCard({ person, compact = false }: PersonCardProps) {
  const encodedWebId = encodeURIComponent(person.webId);

  if (compact) {
    return (
      <div className={`wayfinder-card wayfinder-card--${person.departmentId}`}>
        <Link href={`/people/${encodedWebId}`} className="govuk-link govuk-link--no-visited-state">
          <span className="govuk-heading-s govuk-!-margin-bottom-1">{person.name}</span>
        </Link>
        <p className="govuk-body-s govuk-!-margin-bottom-0">{person.role}</p>
      </div>
    );
  }

  return (
    <div className={`wayfinder-card wayfinder-card--${person.departmentId}`}>
      <div className="wayfinder-card__header">
        <div>
          <h2 className="wayfinder-card__title">
            <Link href={`/people/${encodedWebId}`} className="govuk-link govuk-link--no-visited-state">
              {person.name}
            </Link>
          </h2>
          <p className="wayfinder-card__subtitle">{person.departmentId.toUpperCase()}</p>
        </div>
      </div>

      <div className="wayfinder-card__body">
        <p className="govuk-body govuk-!-font-weight-bold">{person.role}</p>
        <p className="govuk-body-s">
          <a href={`mailto:${person.email}`} className="govuk-link">
            {person.email}
          </a>
        </p>
      </div>

      <div className="wayfinder-card__footer">
        <h3 className="govuk-heading-s govuk-!-margin-bottom-2">Skills</h3>
        <ul className="govuk-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {person.skills.slice(0, 5).map((skill) => (
            <li key={skill}>
              <span className="govuk-tag govuk-tag--grey">{skill}</span>
            </li>
          ))}
          {person.skills.length > 5 && (
            <li>
              <span className="govuk-tag govuk-tag--grey">+{person.skills.length - 5} more</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
