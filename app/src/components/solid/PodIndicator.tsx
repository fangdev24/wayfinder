'use client';

import Link from 'next/link';

interface PodIndicatorProps {
  message: string;
  webId?: string;
}

export function PodIndicator({ message, webId }: PodIndicatorProps) {
  return (
    <div className="wayfinder-pod-indicator">
      <svg
        className="wayfinder-pod-indicator__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      <span className="wayfinder-pod-indicator__text">{message}</span>
      {webId && (
        <Link
          href={`/pod-viewer?webId=${encodeURIComponent(webId)}`}
          className="govuk-link govuk-!-font-size-14 govuk-!-margin-left-2"
        >
          View Pod
        </Link>
      )}
    </div>
  );
}
