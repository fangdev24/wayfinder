/**
 * Extended Person Data with Protected Fields
 *
 * Adds additional fields to person profiles that require
 * different access levels to view.
 *
 * This demonstrates the graduated disclosure model:
 * - Public: name, role, skills
 * - Government: email, Slack
 * - Same department: calendar, focus
 * - Same team: mobile, working patterns
 */

import type { PersonExtended } from '@/lib/access-control';
import { people } from './people';

/**
 * Extended profile data for demo people
 * In production, this would come from their Solid Pods
 */
const extendedData: Record<string, Partial<PersonExtended>> = {
  'river-stone': {
    // Government staff can see
    email: 'river.stone@citizen-support.gov.uk',
    slack: '@river-stone',
    officeHours: 'Tue & Thu, 2-4pm',
    // Same department (DCS) can see
    calendar: 'https://calendar.gov.uk/river-stone',
    currentFocus: 'Eligibility API v3 migration, FHIR integration',
    availability: 'Generally available, prefer async',
    // Same team (puffin) can see
    mobile: '07700 900123',
    homeWorkingDays: 'Mon, Wed, Fri',
    escalationNotes: 'Reach via Slack first. Mobile for P1 only.',
  },
  'ash-morgan': {
    email: 'ash.morgan@revenue.gov.uk',
    slack: '@ash-morgan',
    officeHours: 'Mon & Wed, 10am-12pm',
    calendar: 'https://calendar.gov.uk/ash-morgan',
    currentFocus: 'MTD API performance optimization',
    availability: 'Deep work mornings, meetings afternoons',
    mobile: '07700 900456',
    homeWorkingDays: 'Tue, Thu',
    escalationNotes: 'Tax calculation queries - check wiki first.',
  },
  'slate-wylder': {
    email: 'slate.wylder@identity.gov.uk',
    slack: '@slate-wylder',
    officeHours: 'Daily 3-4pm drop-in',
    calendar: 'https://calendar.gov.uk/slate-wylder',
    currentFocus: 'Biometric API security hardening',
    availability: 'Security reviews priority',
    mobile: '07700 900789',
    homeWorkingDays: 'Mon, Fri',
    escalationNotes: 'Security incidents: call immediately.',
  },
  'flint-rivers': {
    email: 'flint.rivers@standards.gov.uk',
    slack: '@flint-rivers',
    officeHours: 'Thu 2-5pm architecture clinic',
    calendar: 'https://calendar.gov.uk/flint-rivers',
    currentFocus: 'API Gateway v4 planning, mTLS rollout',
    availability: 'Cross-gov consultations welcome',
    mobile: '07700 900321',
    homeWorkingDays: 'Wed, Fri',
    escalationNotes: 'Gateway issues: #granite-platform-support first.',
  },
  'heath-willows': {
    email: 'heath.willows@health-data.gov.uk',
    slack: '@heath-willows',
    officeHours: 'Mon 2-4pm FHIR office hours',
    calendar: 'https://calendar.gov.uk/heath-willows',
    currentFocus: 'NHS App integration, HL7 FHIR R4',
    availability: 'FHIR/health data queries welcome',
    mobile: '07700 900654',
    homeWorkingDays: 'Tue, Thu',
    escalationNotes: 'Patient data issues: follow NHDS incident process.',
  },
};

/**
 * Get extended person data with all fields
 */
export function getExtendedPerson(personId: string): PersonExtended | null {
  const basePerson = people.find((p) => p.id === personId);
  if (!basePerson) return null;

  const extended = extendedData[personId] || {};

  return {
    ...basePerson,
    ...extended,
  };
}

/**
 * Get extended person by WebID
 */
export function getExtendedPersonByWebId(webId: string): PersonExtended | null {
  const basePerson = people.find((p) => p.webId === webId);
  if (!basePerson) return null;

  return getExtendedPerson(basePerson.id);
}

/**
 * Get all extended people
 */
export function getAllExtendedPeople(): PersonExtended[] {
  return people.map((p) => ({
    ...p,
    ...(extendedData[p.id] || {}),
  }));
}
