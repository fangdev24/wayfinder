'use client';

/**
 * Person Profile with Pod-Based Access Control
 *
 * Demonstrates graduated disclosure based on the requester's
 * Solid Pod identity. Access levels are determined by comparing
 * the requester's Pod attributes with the profile owner's.
 *
 * Access Levels:
 * - Public: name, role, skills, services
 * - Government: +email, slack, office hours
 * - Same Department: +calendar, current focus
 * - Same Team: +mobile, working patterns, escalation notes
 */

import { useState } from 'react';
import Link from 'next/link';
import { WebIdVerification } from './WebIdVerification';
import {
  getAccessLevelLabel,
  getAccessLevelColor,
  DEFAULT_VISIBILITY,
} from '@/lib/access-control';
import type { AccessEvaluation, PersonExtended } from '@/lib/access-control';
import type { Team } from '@/data-source/schema';
import type { Service } from '@/lib/data';
import { ServiceCard } from '@/components/cards/ServiceCard';

interface PersonProfileWithAccessProps {
  person: PersonExtended;
  team: Team | undefined;
  maintainedServices: (Service | undefined)[];
}

/**
 * Access level badge component
 */
function AccessBadge({ evaluation }: { evaluation: AccessEvaluation }) {
  return (
    <div
      className="govuk-!-padding-3 govuk-!-margin-bottom-4"
      style={{
        background: '#f3f2f1',
        borderLeft: `5px solid ${getAccessLevelColor(evaluation.accessLevel)}`,
      }}
    >
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span
            className="govuk-tag govuk-!-margin-right-2"
            style={{
              backgroundColor: getAccessLevelColor(evaluation.accessLevel),
              color: '#ffffff',
            }}
          >
            {getAccessLevelLabel(evaluation.accessLevel)}
          </span>
          <span className="govuk-body-s">{evaluation.reason}</span>
        </div>
        <div className="govuk-grid-column-one-third" style={{ textAlign: 'right' }}>
          <span className="govuk-body-s" style={{ color: '#505a5f' }}>
            {evaluation.visibleFields.length} of{' '}
            {evaluation.visibleFields.length + evaluation.hiddenFields.length} fields visible
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Protected field display - shows value or locked indicator
 */
function ProtectedField({
  label,
  value,
  isVisible,
  requiredLevel,
}: {
  label: string;
  value: string | undefined;
  isVisible: boolean;
  requiredLevel: string;
}) {
  if (isVisible && value) {
    return (
      <div className="govuk-!-margin-bottom-3">
        <dt className="govuk-heading-s govuk-!-margin-bottom-1">{label}</dt>
        <dd className="govuk-body">{value}</dd>
      </div>
    );
  }

  return (
    <div className="govuk-!-margin-bottom-3" style={{ opacity: 0.6 }}>
      <dt className="govuk-heading-s govuk-!-margin-bottom-1">
        {label}
        <span
          className="govuk-tag govuk-tag--grey govuk-!-margin-left-2"
          style={{ fontSize: '12px' }}
        >
          {requiredLevel}
        </span>
      </dt>
      <dd className="govuk-body" style={{ color: '#505a5f', fontStyle: 'italic' }}>
        Verify identity to view
      </dd>
    </div>
  );
}

export function PersonProfileWithAccess({
  person,
  team,
  maintainedServices,
}: PersonProfileWithAccessProps) {
  // Default to public access
  const defaultEvaluation: AccessEvaluation = {
    requester: { webId: '', domain: '', isGovernment: false },
    accessLevel: 'public',
    visibleFields: DEFAULT_VISIBILITY.public,
    hiddenFields: [
      ...DEFAULT_VISIBILITY.government,
      ...DEFAULT_VISIBILITY.sameDepartment,
      ...DEFAULT_VISIBILITY.sameTeam,
    ],
    reason: 'No identity verified',
  };

  const [evaluation, setEvaluation] = useState<AccessEvaluation>(defaultEvaluation);

  const handleVerified = (newEvaluation: AccessEvaluation) => {
    setEvaluation(newEvaluation);
  };

  // Helper to check if a field is visible
  const isFieldVisible = (field: string) => {
    return evaluation.visibleFields.includes(field);
  };

  return (
    <>
      {/* WebID Verification Panel */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <WebIdVerification
            profileOwner={{
              departmentId: person.departmentId,
              teamId: person.teamId,
              name: person.name,
            }}
            onVerified={handleVerified}
            currentEvaluation={evaluation}
          />
        </div>
      </div>

      {/* Access Level Indicator */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <AccessBadge evaluation={evaluation} />
        </div>
      </div>

      {/* Profile Content */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        {/* Main Profile */}
        <div className="govuk-grid-column-two-thirds">
          {/* Name and Role - Always Public */}
          <h1 className="govuk-heading-xl govuk-!-margin-bottom-2">{person.name}</h1>
          <p className="govuk-body-l" style={{ color: '#505a5f' }}>
            {person.role}
          </p>

          {/* Skills - Always Public */}
          <div className="govuk-!-margin-top-6">
            <h2 className="govuk-heading-m">Skills</h2>
            <ul className="govuk-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {person.skills.map((skill) => (
                <li key={skill}>
                  <span className="govuk-tag govuk-tag--grey">{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Focus - Same Department */}
          <div className="govuk-!-margin-top-6">
            <ProtectedField
              label="Current Focus"
              value={person.currentFocus}
              isVisible={isFieldVisible('currentFocus')}
              requiredLevel="Same Dept"
            />
            <ProtectedField
              label="Availability"
              value={person.availability}
              isVisible={isFieldVisible('availability')}
              requiredLevel="Same Dept"
            />
          </div>

          {/* Working Patterns - Same Team */}
          <div className="govuk-!-margin-top-6">
            <ProtectedField
              label="Home Working Days"
              value={person.homeWorkingDays}
              isVisible={isFieldVisible('homeWorkingDays')}
              requiredLevel="Same Team"
            />
            <ProtectedField
              label="Escalation Notes"
              value={person.escalationNotes}
              isVisible={isFieldVisible('escalationNotes')}
              requiredLevel="Same Team"
            />
          </div>
        </div>

        {/* Sidebar - Contact Info */}
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', marginBottom: '16px' }}
          >
            <h2 className="govuk-heading-s">Contact</h2>

            {/* Email - Government */}
            <ProtectedField
              label="Email"
              value={person.email}
              isVisible={isFieldVisible('email')}
              requiredLevel="Gov Staff"
            />

            {/* Slack - Government */}
            <ProtectedField
              label="Slack"
              value={person.slack}
              isVisible={isFieldVisible('slack')}
              requiredLevel="Gov Staff"
            />

            {/* Office Hours - Government */}
            <ProtectedField
              label="Office Hours"
              value={person.officeHours}
              isVisible={isFieldVisible('officeHours')}
              requiredLevel="Gov Staff"
            />

            {/* Mobile - Same Team */}
            <ProtectedField
              label="Mobile"
              value={person.mobile}
              isVisible={isFieldVisible('mobile')}
              requiredLevel="Same Team"
            />

            {/* Calendar - Same Department */}
            {isFieldVisible('calendar') && person.calendar && (
              <div className="govuk-!-margin-bottom-3">
                <dt className="govuk-heading-s govuk-!-margin-bottom-1">Calendar</dt>
                <dd className="govuk-body">
                  <a href={person.calendar} className="govuk-link" target="_blank" rel="noreferrer">
                    View Calendar
                  </a>
                </dd>
              </div>
            )}
            {!isFieldVisible('calendar') && (
              <ProtectedField
                label="Calendar"
                value={undefined}
                isVisible={false}
                requiredLevel="Same Dept"
              />
            )}
          </div>

          {/* Team Info - Always visible (public) */}
          {team && (
            <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
              <h2 className="govuk-heading-s">Team</h2>
              <p className="govuk-body">
                <Link href={`/teams/${team.id}`} className="govuk-link">
                  {team.name}
                </Link>
              </p>
              <p className="govuk-body-s" style={{ color: '#505a5f' }}>
                {team.departmentId.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Services Maintained - Always Public */}
      {maintainedServices.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Maintains ({maintainedServices.length} services)
            </h2>
            <div className="wayfinder-grid wayfinder-grid--2-col">
              {maintainedServices.map((service) =>
                service ? <ServiceCard key={service.id} service={service} compact /> : null
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden Fields Indicator */}
      {evaluation && evaluation.hiddenFields.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-two-thirds">
            <details className="govuk-details">
              <summary className="govuk-details__summary">
                <span className="govuk-details__summary-text">
                  {evaluation.hiddenFields.length} fields hidden from view
                </span>
              </summary>
              <div className="govuk-details__text">
                <p className="govuk-body">
                  The following fields are protected and require higher access:
                </p>
                <ul className="govuk-list govuk-list--bullet">
                  {evaluation.hiddenFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
                <p className="govuk-body-s" style={{ color: '#505a5f' }}>
                  Enter your WebID above to verify your identity and unlock additional fields
                  based on your department and team membership.
                </p>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* About Access Control - Demo Info */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <details className="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                How does access control work?
              </span>
            </summary>
            <div className="govuk-details__text">
              <p className="govuk-body">
                This profile uses <strong>Pod-to-Pod verification</strong>. When you enter your
                WebID, we fetch your Solid Pod to verify your identity attributes.
              </p>
              <table className="govuk-table">
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th className="govuk-table__header">Access Level</th>
                    <th className="govuk-table__header">Requirement</th>
                    <th className="govuk-table__header">Additional Fields</th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell">Public</td>
                    <td className="govuk-table__cell">None</td>
                    <td className="govuk-table__cell">Name, role, skills, services</td>
                  </tr>
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell">Government</td>
                    <td className="govuk-table__cell">.gov.uk WebID</td>
                    <td className="govuk-table__cell">Email, Slack, office hours</td>
                  </tr>
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell">Same Dept</td>
                    <td className="govuk-table__cell">Same departmentId</td>
                    <td className="govuk-table__cell">Calendar, current focus</td>
                  </tr>
                  <tr className="govuk-table__row">
                    <td className="govuk-table__cell">Same Team</td>
                    <td className="govuk-table__cell">Same teamId</td>
                    <td className="govuk-table__cell">Mobile, working patterns</td>
                  </tr>
                </tbody>
              </table>
              <p className="govuk-body-s" style={{ color: '#505a5f' }}>
                This is a demo. In production, Pod verification would use cryptographic
                signatures and real-time Pod fetches.
              </p>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
