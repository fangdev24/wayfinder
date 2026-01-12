/**
 * Access Control Evaluator
 *
 * Evaluates access based on the requester's Pod profile.
 * Implements attribute-based access control (ABAC) using
 * the requester's verifiable Pod attributes.
 */

import type {
  AccessLevel,
  AccessEvaluation,
  RequesterIdentity,
  ProfileVisibility,
  PersonExtended,
} from './types';
import { fetchSolidProfile } from '@/lib/solid-client';
import { getPersonByWebId } from '@/lib/data';

/**
 * Default visibility configuration
 * Defines which fields are visible at each access level
 */
export const DEFAULT_VISIBILITY: ProfileVisibility = {
  public: ['id', 'name', 'role', 'departmentId', 'teamId', 'skills', 'maintains', 'webId', 'photo'],
  authenticated: [], // No additional fields for just having a Pod
  government: ['email', 'slack', 'officeHours'],
  sameDepartment: ['calendar', 'currentFocus', 'availability'],
  sameTeam: ['mobile', 'homeWorkingDays', 'escalationNotes'],
};

/**
 * Government domain patterns
 * In production, this would be a comprehensive list
 */
const GOV_DOMAIN_PATTERNS = [
  '.gov.uk',
  '.gov.example', // Demo domain
  'demo.gov.example', // Demo domain
];

/**
 * Extract domain from a WebID URL
 */
function extractDomain(webId: string): string {
  try {
    const url = new URL(webId);
    return url.hostname;
  } catch {
    return '';
  }
}

/**
 * Check if a domain is a government domain
 */
function isGovernmentDomain(domain: string): boolean {
  return GOV_DOMAIN_PATTERNS.some(
    (pattern) => domain.endsWith(pattern) || domain.includes(pattern)
  );
}

/**
 * Fetch and parse requester's identity from their Pod
 */
export async function fetchRequesterIdentity(
  requesterWebId: string
): Promise<RequesterIdentity | null> {
  const domain = extractDomain(requesterWebId);

  // First try to get from our demo data (for local Pods)
  // All demo people are government staff, so treat them as such
  const localPerson = getPersonByWebId(requesterWebId);
  if (localPerson) {
    return {
      webId: requesterWebId,
      name: localPerson.name,
      departmentId: localPerson.departmentId,
      teamId: localPerson.teamId,
      domain,
      // Demo people are all government staff - don't rely on domain check
      isGovernment: true,
    };
  }

  // Try to fetch from the actual Pod
  try {
    const podProfile = await fetchSolidProfile(requesterWebId);
    if (podProfile) {
      // Extract department/team from WebID URL structure if not in profile
      // e.g., https://pods.dwp.gov.uk/jane-smith/ -> department might be inferred
      return {
        webId: requesterWebId,
        name: podProfile.name,
        departmentId: undefined, // Would need to be in Pod profile
        teamId: undefined,
        domain,
        isGovernment: isGovernmentDomain(domain),
      };
    }
  } catch (error) {
    console.debug('[AccessControl] Could not fetch requester Pod:', error);
  }

  // Minimal identity based on WebID URL only
  return {
    webId: requesterWebId,
    domain,
    isGovernment: isGovernmentDomain(domain),
  };
}

/**
 * Determine access level based on requester and profile owner
 */
export function determineAccessLevel(
  requester: RequesterIdentity,
  profileOwner: { departmentId: string; teamId: string }
): AccessLevel {
  // Same team = highest access
  if (requester.teamId && requester.teamId === profileOwner.teamId) {
    return 'same-team';
  }

  // Same department = high access
  if (requester.departmentId && requester.departmentId === profileOwner.departmentId) {
    return 'same-department';
  }

  // Government domain = medium access
  if (requester.isGovernment) {
    return 'government';
  }

  // Has a Pod = basic authenticated
  if (requester.webId) {
    return 'authenticated';
  }

  return 'public';
}

/**
 * Get all visible fields for an access level
 * Higher levels inherit from lower levels
 */
export function getVisibleFields(
  accessLevel: AccessLevel,
  visibility: ProfileVisibility = DEFAULT_VISIBILITY
): string[] {
  const fields = new Set<string>();

  // Always include public fields
  visibility.public.forEach((f) => fields.add(f));

  // Add fields based on access level (cumulative)
  const levelOrder: AccessLevel[] = [
    'public',
    'authenticated',
    'government',
    'same-department',
    'same-team',
  ];
  const levelIndex = levelOrder.indexOf(accessLevel);

  if (levelIndex >= 1) visibility.authenticated.forEach((f) => fields.add(f));
  if (levelIndex >= 2) visibility.government.forEach((f) => fields.add(f));
  if (levelIndex >= 3) visibility.sameDepartment.forEach((f) => fields.add(f));
  if (levelIndex >= 4) visibility.sameTeam.forEach((f) => fields.add(f));

  return Array.from(fields);
}

/**
 * Get all possible fields (for showing what's hidden)
 */
export function getAllFields(): string[] {
  const allFields = new Set<string>();
  Object.values(DEFAULT_VISIBILITY).forEach((fields: string[]) => {
    fields.forEach((f: string) => allFields.add(f));
  });
  return Array.from(allFields);
}

/**
 * Evaluate access for a requester viewing a profile
 */
export async function evaluateAccess(
  requesterWebId: string,
  profileOwner: { departmentId: string; teamId: string }
): Promise<AccessEvaluation> {
  const requester = await fetchRequesterIdentity(requesterWebId);

  if (!requester) {
    return {
      requester: {
        webId: requesterWebId,
        domain: extractDomain(requesterWebId),
        isGovernment: false,
      },
      accessLevel: 'public',
      visibleFields: getVisibleFields('public'),
      hiddenFields: getAllFields().filter(
        (f) => !getVisibleFields('public').includes(f)
      ),
      reason: 'Could not verify requester identity',
    };
  }

  const accessLevel = determineAccessLevel(requester, profileOwner);
  const visibleFields = getVisibleFields(accessLevel);
  const hiddenFields = getAllFields().filter((f) => !visibleFields.includes(f));

  const reasonMap: Record<AccessLevel, string> = {
    public: 'No Pod verification',
    authenticated: 'Valid Pod but not government domain',
    government: 'Government domain verified (.gov.uk)',
    'same-department': `Same department (${requester.departmentId})`,
    'same-team': `Same team (${requester.teamId})`,
  };

  return {
    requester,
    accessLevel,
    visibleFields,
    hiddenFields,
    reason: reasonMap[accessLevel],
  };
}

/**
 * Filter a person profile based on access level
 */
export function filterProfileByAccess<T extends Partial<PersonExtended>>(
  profile: T,
  visibleFields: string[]
): Partial<T> {
  const filtered: Partial<T> = {};

  for (const field of visibleFields) {
    if (field in profile) {
      const key = field as keyof T;
      (filtered as Record<string, unknown>)[field] = profile[key];
    }
  }

  return filtered;
}

/**
 * Human-readable access level label
 */
export function getAccessLevelLabel(level: AccessLevel): string {
  const labels: Record<AccessLevel, string> = {
    public: 'Public',
    authenticated: 'Authenticated Pod',
    government: 'Government Staff',
    'same-department': 'Same Department',
    'same-team': 'Same Team',
  };
  return labels[level];
}

/**
 * Access level badge color
 */
export function getAccessLevelColor(level: AccessLevel): string {
  const colors: Record<AccessLevel, string> = {
    public: '#505a5f',
    authenticated: '#1d70b8',
    government: '#00703c',
    'same-department': '#4c2c92',
    'same-team': '#d4351c',
  };
  return colors[level];
}
