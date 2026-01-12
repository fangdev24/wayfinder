'use client';

/**
 * Capability Matrix Component
 *
 * Shows a side-by-side comparison of capabilities between
 * api.gov.uk (current state) and Wayfinder (proposed state).
 */

import { CAPABILITY_MATRIX, getCapabilitySummary } from '@/lib/govuk-api';
import type { CapabilityItem } from '@/lib/govuk-api';

function StatusIcon({ status }: { status: CapabilityItem['govukStatus'] }) {
  switch (status) {
    case 'available':
      return <span style={{ color: '#00703c' }}>✓</span>;
    case 'partial':
      return <span style={{ color: '#f47738' }}>◐</span>;
    case 'unavailable':
      return <span style={{ color: '#d4351c' }}>✗</span>;
  }
}

function ImportanceBadge({ importance }: { importance: CapabilityItem['importance'] }) {
  const colors = {
    critical: { bg: '#d4351c', text: '#ffffff' },
    high: { bg: '#f47738', text: '#ffffff' },
    medium: { bg: '#f3f2f1', text: '#0b0c0c' },
    low: { bg: '#f3f2f1', text: '#505a5f' },
  };

  const style = colors[importance];

  return (
    <span
      className="govuk-tag"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        fontSize: '12px',
        padding: '2px 6px',
      }}
    >
      {importance}
    </span>
  );
}

export function CapabilityMatrix() {
  const summary = getCapabilitySummary();

  return (
    <div className="govuk-!-margin-bottom-8">
      <h2 className="govuk-heading-l">Capability Comparison</h2>

      <p className="govuk-body">
        Building on api.gov.uk, Wayfinder adds capabilities that enable governance visibility,
        agent access, and cross-department discovery.
      </p>

      {/* Summary Stats */}
      <div className="govuk-grid-row govuk-!-margin-bottom-6">
        <div className="govuk-grid-column-one-half">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderLeft: '5px solid #1d70b8' }}
          >
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">api.gov.uk (Today)</h3>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>{summary.govuk.available}</strong> available,{' '}
              <strong>{summary.govuk.partial}</strong> partial,{' '}
              <strong>{summary.govuk.unavailable}</strong> unavailable
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-half">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderLeft: '5px solid #00703c' }}
          >
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">With Wayfinder</h3>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>{summary.wayfinder.available}</strong> available,{' '}
              <strong>{summary.wayfinder.unavailable}</strong> unavailable
            </p>
          </div>
        </div>
      </div>

      {/* Capability Table */}
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header" style={{ width: '25%' }}>
              Capability
            </th>
            <th scope="col" className="govuk-table__header" style={{ width: '10%' }}>
              Priority
            </th>
            <th scope="col" className="govuk-table__header" style={{ width: '30%' }}>
              api.gov.uk
            </th>
            <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>
              Wayfinder
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {CAPABILITY_MATRIX.map((cap) => (
            <tr key={cap.name} className="govuk-table__row">
              <td className="govuk-table__cell">
                <strong>{cap.name}</strong>
                <br />
                <span className="govuk-body-s" style={{ color: '#505a5f' }}>
                  {cap.description}
                </span>
              </td>
              <td className="govuk-table__cell">
                <ImportanceBadge importance={cap.importance} />
              </td>
              <td className="govuk-table__cell">
                <StatusIcon status={cap.govukStatus} />{' '}
                <span className="govuk-body-s">{cap.govukDetail}</span>
              </td>
              <td className="govuk-table__cell">
                <StatusIcon status={cap.wayfinderStatus} />{' '}
                <span className="govuk-body-s">{cap.wayfinderDetail}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="govuk-body-s" style={{ color: '#505a5f' }}>
        <span style={{ color: '#00703c' }}>✓</span> Available |{' '}
        <span style={{ color: '#f47738' }}>◐</span> Partial |{' '}
        <span style={{ color: '#d4351c' }}>✗</span> Unavailable
      </div>
    </div>
  );
}
