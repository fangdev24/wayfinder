'use client';

/**
 * WebID Verification Component
 *
 * Allows users to enter their Pod WebID to verify their identity
 * and unlock additional profile information based on their attributes.
 */

import { useState } from 'react';
import {
  evaluateAccess,
  getAccessLevelLabel,
  getAccessLevelColor,
  type AccessEvaluation,
} from '@/lib/access-control';
import { people } from '@/lib/data';

interface WebIdVerificationProps {
  profileOwner: {
    departmentId: string;
    teamId: string;
    name: string;
  };
  onVerified: (evaluation: AccessEvaluation) => void;
  currentEvaluation?: AccessEvaluation | null;
}

export function WebIdVerification({
  profileOwner,
  onVerified,
  currentEvaluation,
}: WebIdVerificationProps) {
  const [webIdInput, setWebIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get list of demo WebIDs for quick selection
  const demoWebIds = people.map((p) => ({
    webId: p.webId,
    name: p.name,
    department: p.departmentId.toUpperCase(),
    team: p.teamId,
  }));

  const handleVerify = async () => {
    if (!webIdInput.trim()) {
      setError('Please enter a WebID');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const evaluation = await evaluateAccess(webIdInput.trim(), profileOwner);
      onVerified(evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickSelect = (webId: string) => {
    setWebIdInput(webId);
  };

  const handleClear = () => {
    setWebIdInput('');
    setError(null);
    onVerified({
      requester: {
        webId: '',
        domain: '',
        isGovernment: false,
      },
      accessLevel: 'public',
      visibleFields: [],
      hiddenFields: [],
      reason: 'No verification',
    });
  };

  return (
    <div
      className="govuk-!-padding-4 govuk-!-margin-bottom-6"
      style={{
        background: '#f3f2f1',
        border: '1px solid #b1b4b6',
      }}
    >
      <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
        🔐 Pod-Based Access Verification
      </h3>

      {currentEvaluation && currentEvaluation.accessLevel !== 'public' ? (
        // Show current verification status
        <div>
          <div
            className="govuk-!-padding-3 govuk-!-margin-bottom-3"
            style={{
              background: '#ffffff',
              borderLeft: `4px solid ${getAccessLevelColor(currentEvaluation.accessLevel)}`,
            }}
          >
            <p className="govuk-body-s govuk-!-margin-bottom-1">
              <strong>Viewing as:</strong> {currentEvaluation.requester.name || 'Unknown'}
            </p>
            <p className="govuk-body-s govuk-!-margin-bottom-1">
              <span
                className="govuk-tag"
                style={{
                  backgroundColor: getAccessLevelColor(currentEvaluation.accessLevel),
                  color: '#ffffff',
                }}
              >
                {getAccessLevelLabel(currentEvaluation.accessLevel)}
              </span>
            </p>
            <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>
              {currentEvaluation.reason}
            </p>
          </div>

          <button
            type="button"
            className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
            onClick={handleClear}
          >
            Clear verification
          </button>
        </div>
      ) : (
        // Show verification form
        <div>
          <p className="govuk-body-s govuk-!-margin-bottom-3">
            Enter your Pod WebID to verify your identity and see more information
            about {profileOwner.name}.
          </p>

          <div className="govuk-form-group govuk-!-margin-bottom-3">
            <label className="govuk-label govuk-label--s" htmlFor="webid-input">
              Your WebID
            </label>
            <div className="govuk-hint govuk-!-font-size-14">
              e.g., http://localhost:3002/jane-smith/profile/card#me
            </div>
            <input
              className="govuk-input"
              id="webid-input"
              type="text"
              value={webIdInput}
              onChange={(e) => setWebIdInput(e.target.value)}
              placeholder="Enter your WebID URL"
              style={{ maxWidth: '100%' }}
            />
          </div>

          {error && (
            <p className="govuk-error-message govuk-!-margin-bottom-3">
              <span className="govuk-visually-hidden">Error:</span> {error}
            </p>
          )}

          <button
            type="button"
            className="govuk-button govuk-!-margin-bottom-3"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Pod'}
          </button>

          {/* Quick select for demo */}
          <details className="govuk-details govuk-!-margin-bottom-0">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                Demo: Select a test identity
              </span>
            </summary>
            <div className="govuk-details__text">
              <p className="govuk-body-s">
                For demo purposes, select one of the existing Pod identities:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {demoWebIds.map((demo) => (
                  <button
                    key={demo.webId}
                    type="button"
                    className="govuk-button govuk-button--secondary"
                    style={{
                      fontSize: '14px',
                      padding: '6px 12px',
                      marginBottom: 0,
                    }}
                    onClick={() => handleQuickSelect(demo.webId)}
                  >
                    {demo.name}
                    <br />
                    <span style={{ fontSize: '11px', color: '#505a5f' }}>
                      {demo.department} / {demo.team}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/**
 * Access level indicator showing what data is visible/hidden
 */
export function AccessLevelIndicator({
  evaluation,
  profileOwner,
}: {
  evaluation: AccessEvaluation;
  profileOwner: { name: string };
}) {
  const hiddenCount = evaluation.hiddenFields.length;

  if (evaluation.accessLevel === 'public' || !evaluation.requester.webId) {
    return (
      <div
        className="govuk-inset-text"
        style={{ borderColor: '#505a5f' }}
      >
        <p className="govuk-body-s govuk-!-margin-bottom-0">
          <strong>Public view</strong> — Verify your Pod identity above to see more
          information about {profileOwner.name}.
          {hiddenCount > 0 && (
            <span style={{ color: '#505a5f' }}>
              {' '}({hiddenCount} additional fields available to verified users)
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div
      className="govuk-inset-text"
      style={{ borderColor: getAccessLevelColor(evaluation.accessLevel) }}
    >
      <p className="govuk-body-s govuk-!-margin-bottom-2">
        <span
          className="govuk-tag govuk-!-margin-right-2"
          style={{
            backgroundColor: getAccessLevelColor(evaluation.accessLevel),
            color: '#ffffff',
          }}
        >
          {getAccessLevelLabel(evaluation.accessLevel)}
        </span>
        <strong>{evaluation.requester.name || 'Unknown'}</strong>
        {evaluation.requester.departmentId && (
          <span style={{ color: '#505a5f' }}>
            {' '}({evaluation.requester.departmentId.toUpperCase()})
          </span>
        )}
      </p>
      <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>
        {evaluation.reason}
        {hiddenCount > 0 && (
          <span>
            {' '}• {hiddenCount} fields require higher access level
          </span>
        )}
      </p>
    </div>
  );
}
