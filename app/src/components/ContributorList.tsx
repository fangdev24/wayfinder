import Link from 'next/link';
import type { Contributor } from '@/lib/data';
import { getTeamById } from '@/lib/data';

interface ContributorListProps {
  contributors: Contributor[];
}

export function ContributorList({ contributors }: ContributorListProps) {
  if (contributors.length === 0) {
    return (
      <p className="govuk-body govuk-!-colour-secondary">
        No contributors documented yet.
      </p>
    );
  }

  return (
    <ul className="govuk-list">
      {contributors.map((contributor, idx) => {
        const team = getTeamById(contributor.teamId);
        return (
          <li key={`${contributor.teamId}-${idx}`} className="govuk-!-margin-bottom-2">
            <Link href={`/teams/${contributor.teamId}`} className="govuk-link">
              {team?.name || contributor.teamId}
            </Link>
            <span className="govuk-body-s govuk-!-margin-left-2">
              — {contributor.contribution}
            </span>
            <span className="govuk-body-s govuk-!-colour-secondary govuk-!-margin-left-2">
              ({new Date(contributor.date).toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric',
              })})
            </span>
          </li>
        );
      })}
    </ul>
  );
}
