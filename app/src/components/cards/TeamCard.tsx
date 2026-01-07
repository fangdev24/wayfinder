import Link from 'next/link';
import type { Team } from '@/lib/data';

interface TeamCardProps {
  team: Team;
  compact?: boolean;
}

export function TeamCard({ team, compact = false }: TeamCardProps) {
  if (compact) {
    return (
      <div className={`wayfinder-card wayfinder-card--${team.departmentId}`}>
        <Link href={`/teams/${team.id}`} className="govuk-link govuk-link--no-visited-state">
          <span className="govuk-heading-s govuk-!-margin-bottom-1">{team.name}</span>
        </Link>
        <p className="govuk-body-s govuk-!-margin-bottom-0">{team.departmentId.toUpperCase()}</p>
      </div>
    );
  }

  return (
    <div className={`wayfinder-card wayfinder-card--${team.departmentId}`}>
      <div className="wayfinder-card__header">
        <div>
          <h2 className="wayfinder-card__title">
            <Link href={`/teams/${team.id}`} className="govuk-link govuk-link--no-visited-state">
              {team.name}
            </Link>
          </h2>
          <p className="wayfinder-card__subtitle">{team.departmentId.toUpperCase()}</p>
        </div>
      </div>

      <div className="wayfinder-card__body">
        <p>{team.description}</p>
      </div>

      <div className="wayfinder-card__footer">
        <p className="govuk-body-s govuk-!-margin-bottom-0">
          Slack: <code>{team.slack}</code>
        </p>
        <p className="govuk-body-s govuk-!-margin-bottom-0">
          Services: {team.services.length}
        </p>
      </div>
    </div>
  );
}
