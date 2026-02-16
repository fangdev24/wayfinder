import Link from 'next/link';
import type { DataSharingAgreement } from '@/lib/data';
import { getDepartmentById } from '@/lib/data';

interface DataSharingAgreementCardProps {
  agreement: DataSharingAgreement;
  compact?: boolean;
}

const STATUS_COLOURS: Record<string, string> = {
  active: '#00703c',
  draft: '#f47738',
  expired: '#d4351c',
  'under-review': '#1d70b8',
};

const CATEGORY_LABELS: Record<string, string> = {
  income: 'Income',
  identity: 'Identity',
  health: 'Health',
  benefits: 'Benefits',
  address: 'Address',
  employment: 'Employment',
  other: 'Other',
};

export function DataSharingAgreementCard({
  agreement,
  compact = false,
}: DataSharingAgreementCardProps) {
  const provider = getDepartmentById(agreement.providingDepartmentId);
  const consumer = getDepartmentById(agreement.consumingDepartmentId);

  if (compact) {
    return (
      <div
        className="govuk-!-padding-3"
        style={{
          background: '#f3f2f1',
          borderLeft: `4px solid ${provider?.colour || '#6f72af'}`,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <span
            className="govuk-tag"
            style={{ background: STATUS_COLOURS[agreement.status] || '#505a5f' }}
          >
            {agreement.status}
          </span>
          <span className="govuk-tag govuk-tag--grey">
            {CATEGORY_LABELS[agreement.category] || agreement.category}
          </span>
        </div>

        <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
          <Link
            href={`/data-sharing-agreements/${agreement.id}`}
            className="govuk-link govuk-link--no-visited-state"
          >
            {agreement.name}
          </Link>
        </h3>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
          <span style={{ color: provider?.colour, fontWeight: 'bold' }}>
            {provider?.acronym}
          </span>
          {' '}&rarr;{' '}
          <span style={{ color: consumer?.colour, fontWeight: 'bold' }}>
            {consumer?.acronym}
          </span>
        </p>

        <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>
          Effective: {agreement.effectiveDate}
        </p>
      </div>
    );
  }

  return (
    <div
      className="govuk-!-padding-4"
      style={{
        background: '#f3f2f1',
        borderLeft: `4px solid ${provider?.colour || '#6f72af'}`,
        minHeight: '200px',
      }}
    >
      {/* Status and Category badges */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <span
          className="govuk-tag"
          style={{ background: STATUS_COLOURS[agreement.status] || '#505a5f' }}
        >
          {agreement.status}
        </span>
        <span className="govuk-tag govuk-tag--grey">
          {CATEGORY_LABELS[agreement.category] || agreement.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="govuk-heading-s govuk-!-margin-bottom-2">
        <Link
          href={`/data-sharing-agreements/${agreement.id}`}
          className="govuk-link govuk-link--no-visited-state"
        >
          {agreement.name}
        </Link>
      </h3>

      {/* Description */}
      <p className="govuk-body-s govuk-!-margin-bottom-3">
        {agreement.description.substring(0, 150)}
        {agreement.description.length > 150 ? '...' : ''}
      </p>

      {/* Parties */}
      <p className="govuk-body-s govuk-!-margin-bottom-2">
        <strong>Provider:</strong>{' '}
        <span style={{ color: provider?.colour }}>{provider?.acronym}</span>
        {' '}&bull;{' '}
        <strong>Consumer:</strong>{' '}
        <span style={{ color: consumer?.colour }}>{consumer?.acronym}</span>
      </p>

      {/* Data elements count */}
      <p className="govuk-body-s govuk-!-margin-bottom-2">
        <strong>Data elements:</strong> {agreement.dataElements.length}
        {' '}&bull;{' '}
        <strong>Ref:</strong> {agreement.reference}
      </p>

      {/* Legal basis */}
      <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>
        {agreement.legalBasis}
      </p>
    </div>
  );
}
