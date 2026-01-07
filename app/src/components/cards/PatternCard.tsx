import Link from 'next/link';
import type { Pattern } from '@/lib/data';

interface PatternCardProps {
  pattern: Pattern;
  compact?: boolean;
}

export function PatternCard({ pattern, compact = false }: PatternCardProps) {
  if (compact) {
    return (
      <div className="wayfinder-card">
        <Link href={`/patterns/${pattern.id}`} className="govuk-link govuk-link--no-visited-state">
          <span className="govuk-heading-s govuk-!-margin-bottom-1">{pattern.name}</span>
        </Link>
        <p className="govuk-body-s govuk-!-margin-bottom-0">{pattern.category}</p>
      </div>
    );
  }

  return (
    <div className="wayfinder-card">
      <div className="wayfinder-card__header">
        <div>
          <h2 className="wayfinder-card__title">
            <Link href={`/patterns/${pattern.id}`} className="govuk-link govuk-link--no-visited-state">
              {pattern.name}
            </Link>
          </h2>
          <p className="wayfinder-card__subtitle">{pattern.category}</p>
        </div>
        <span className="govuk-tag govuk-tag--blue">{pattern.category}</span>
      </div>

      <div className="wayfinder-card__body">
        <p>{pattern.description}</p>
      </div>

      <div className="wayfinder-card__footer">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {pattern.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="govuk-tag govuk-tag--grey">
              {tag}
            </span>
          ))}
          {pattern.tags.length > 4 && (
            <span className="govuk-tag govuk-tag--grey">+{pattern.tags.length - 4} more</span>
          )}
        </div>
        <p className="govuk-body-s govuk-!-margin-top-2 govuk-!-margin-bottom-0">
          {pattern.implementedBy.length} implementation{pattern.implementedBy.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
