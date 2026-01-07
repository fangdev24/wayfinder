'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchSolidProfile } from '@/lib/solid-client';
import type { Person } from '@/lib/data';

interface PersonProfileProps {
  webId: string;
  fallbackData: Person;
}

export function PersonProfile({ webId, fallbackData }: PersonProfileProps) {
  const {
    data: podData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['solid-profile', webId],
    queryFn: () => fetchSolidProfile(webId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once (Pods may just be offline)
    retryDelay: 1000,
  });

  // Merge Pod data with fallback (Pod takes precedence when available)
  const person = podData
    ? {
        ...fallbackData,
        name: podData.name || fallbackData.name,
        role: podData.role || fallbackData.role,
        email: podData.email || fallbackData.email,
        skills: podData.skills || fallbackData.skills,
      }
    : fallbackData;

  const getPodStatusTag = () => {
    if (isLoading) {
      return (
        <span className="govuk-tag govuk-tag--yellow">
          Fetching from Pod...
        </span>
      );
    }

    if (isError) {
      return (
        <span className="govuk-tag govuk-tag--red">
          Pod error - showing cached data
        </span>
      );
    }

    if (podData) {
      return (
        <span className="govuk-tag govuk-tag--green">
          Live from Pod
        </span>
      );
    }

    return (
      <span className="govuk-tag govuk-tag--grey">
        Pod offline - using demo data
      </span>
    );
  };

  return (
    <div>
      <h1 className="govuk-heading-xl govuk-!-margin-bottom-2">{person.name}</h1>
      <p className="govuk-body-l govuk-!-margin-bottom-4">{person.role}</p>

      <p className="govuk-body-s govuk-!-margin-bottom-4">
        {getPodStatusTag()}
      </p>

      {podData && (
        <div className="govuk-inset-text">
          <p className="govuk-body-s govuk-!-margin-bottom-0">
            <strong>Live data from Solid Pod:</strong> This profile was fetched
            directly from {person.name}&apos;s personal data store, not from
            Wayfinder&apos;s database.
          </p>
        </div>
      )}

      {isError && (
        <details className="govuk-details govuk-!-margin-top-2">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              Technical details
            </span>
          </summary>
          <div className="govuk-details__text">
            <p className="govuk-body-s">
              Could not connect to the Solid Pod at: <code>{webId}</code>
            </p>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </details>
      )}
    </div>
  );
}
