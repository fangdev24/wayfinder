'use client';

/**
 * Delete Team Button
 *
 * Client component for team deletion with confirmation.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteTeamButtonProps {
  teamId: string;
  teamName: string;
  hasServices: boolean;
}

export function DeleteTeamButton({ teamId, teamName, hasServices }: DeleteTeamButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to delete team');
        setIsDeleting(false);
        return;
      }

      router.push('/admin/teams');
      router.refresh();
    } catch {
      setError('An error occurred');
      setIsDeleting(false);
    }
  };

  if (hasServices) {
    return (
      <button
        type="button"
        className="govuk-button govuk-button--warning"
        disabled
        title="Cannot delete: team has assigned services"
      >
        Delete
      </button>
    );
  }

  if (showConfirm) {
    return (
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-visually-hidden">Warning</span>
          Delete &quot;{teamName}&quot;?
        </strong>
        {error && (
          <p className="govuk-error-message">{error}</p>
        )}
        <div style={{ marginTop: '10px' }}>
          <button
            type="button"
            className="govuk-button govuk-button--warning"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ marginRight: '10px' }}
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
          <button
            type="button"
            className="govuk-button govuk-button--secondary"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="govuk-button govuk-button--warning"
      onClick={() => setShowConfirm(true)}
    >
      Delete
    </button>
  );
}
