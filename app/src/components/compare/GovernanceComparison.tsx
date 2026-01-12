'use client';

/**
 * Governance Comparison Component
 *
 * Shows the governance gap between api.gov.uk (no policy tracking)
 * and Wayfinder (explicit policy → service relationships).
 */

import { useState } from 'react';
import Link from 'next/link';
import { calculateGovernanceGaps, getGovernanceCoverage } from '@/lib/govuk-api';
import type { GovernanceGap } from '@/lib/govuk-api';

function RiskBadge({ level }: { level: GovernanceGap['riskLevel'] }) {
  const colors = {
    critical: { bg: '#d4351c', text: '#ffffff', label: 'Critical' },
    high: { bg: '#f47738', text: '#ffffff', label: 'High' },
    medium: { bg: '#f3f2f1', text: '#0b0c0c', label: 'Medium' },
    low: { bg: '#f3f2f1', text: '#505a5f', label: 'Low' },
  };

  const style = colors[level];

  return (
    <span
      className="govuk-tag"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        fontSize: '12px',
        padding: '2px 8px',
      }}
    >
      {style.label}
    </span>
  );
}

function CoverageMeter({ percent }: { percent: number }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          background: '#f3f2f1',
          height: '24px',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            background: percent > 50 ? '#00703c' : percent > 25 ? '#f47738' : '#d4351c',
            height: '100%',
            width: `${percent}%`,
            transition: 'width 0.5s ease',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {percent}% governed
        </span>
      </div>
    </div>
  );
}

export function GovernanceComparison() {
  const [showAll, setShowAll] = useState(false);
  const coverage = getGovernanceCoverage();
  const gaps = calculateGovernanceGaps();

  const criticalGaps = gaps.filter((g) => g.riskLevel === 'critical');
  const highGaps = gaps.filter((g) => g.riskLevel === 'high');
  const displayedGaps = showAll ? gaps : gaps.slice(0, 10);

  return (
    <div className="govuk-!-margin-bottom-8">
      <h2 className="govuk-heading-l">Governance Visibility</h2>

      {/* Side by side comparison */}
      <div className="govuk-grid-row govuk-!-margin-bottom-6">
        <div className="govuk-grid-column-one-half">
          <div
            className="govuk-!-padding-4"
            style={{
              background: '#f3f2f1',
              borderLeft: '5px solid #1d70b8',
              minHeight: '200px',
            }}
          >
            <h3 className="govuk-heading-s">api.gov.uk (Today)</h3>
            <p className="govuk-body">
              <strong>0%</strong> governance visibility
            </p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              <li>No policy entities in catalogue</li>
              <li>No service → policy links</li>
              <li>Cannot identify ungoverned services</li>
              <li>Compliance tracking via spreadsheets</li>
            </ul>
            <p className="govuk-body-s" style={{ color: '#505a5f', marginTop: '16px' }}>
              This is not a criticism — policy tracking is outside current scope.
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-half">
          <div
            className="govuk-!-padding-4"
            style={{
              background: '#f3f2f1',
              borderLeft: '5px solid #00703c',
              minHeight: '200px',
            }}
          >
            <h3 className="govuk-heading-s">Wayfinder Demo</h3>
            <CoverageMeter percent={coverage.coveragePercent} />
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              <li>
                <strong>{coverage.governed}</strong> of {coverage.total} services governed
              </li>
              <li>
                <strong>{coverage.ungoverned}</strong> services flagged as ungoverned
              </li>
              <li>
                <strong>{criticalGaps.length}</strong> critical risk gaps identified
              </li>
              <li>
                <strong>{highGaps.length}</strong> high risk gaps identified
              </li>
            </ul>
            <p className="govuk-body-s" style={{ color: '#505a5f', marginTop: '16px' }}>
              Policy → Service relationships make compliance auditable.
            </p>
          </div>
        </div>
      </div>

      {/* Ungoverned Services Table */}
      <h3 className="govuk-heading-m">Ungoverned Services (Demo Data)</h3>
      <p className="govuk-body">
        These services have no explicit policy governance in the Wayfinder demo. In production,
        this view would help compliance teams identify governance gaps.
      </p>

      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header" style={{ width: '30%' }}>
              Service
            </th>
            <th scope="col" className="govuk-table__header" style={{ width: '15%' }}>
              Risk
            </th>
            <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>
              Reason
            </th>
            <th scope="col" className="govuk-table__header" style={{ width: '20%' }}>
              Suggested Policies
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {displayedGaps.map((gap) => (
            <tr key={gap.serviceId} className="govuk-table__row">
              <td className="govuk-table__cell">
                <Link href={`/services/${gap.serviceId}`} className="govuk-link">
                  {gap.serviceName}
                </Link>
              </td>
              <td className="govuk-table__cell">
                <RiskBadge level={gap.riskLevel} />
              </td>
              <td className="govuk-table__cell">
                <span className="govuk-body-s">{gap.reason}</span>
              </td>
              <td className="govuk-table__cell">
                {gap.suggestedPolicies.length > 0 ? (
                  <ul className="govuk-list govuk-body-s" style={{ margin: 0 }}>
                    {gap.suggestedPolicies.map((p) => (
                      <li key={p}>
                        <Link href={`/policies/${p}`} className="govuk-link">
                          {p}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="govuk-body-s" style={{ color: '#505a5f' }}>
                    Review needed
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {gaps.length > 10 && (
        <button
          type="button"
          className="govuk-button govuk-button--secondary"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show fewer' : `Show all ${gaps.length} ungoverned services`}
        </button>
      )}

      {/* Key Insight */}
      <div
        className="govuk-inset-text govuk-!-margin-top-6"
        style={{ borderColor: '#f47738' }}
      >
        <strong>Key insight:</strong> Services like{' '}
        <em>facial-recognition-service</em> and <em>biometric-matching-api</em> handle
        sensitive biometric data but have no explicit policy governance in this demo.
        In production, this visibility would be critical for compliance.
      </div>
    </div>
  );
}
