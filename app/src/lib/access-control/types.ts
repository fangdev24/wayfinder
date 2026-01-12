/**
 * Pod-Based Access Control Types
 *
 * Defines the access control model for graduated disclosure
 * based on the requester's Pod profile attributes.
 */

/**
 * Access levels in order of increasing trust
 */
export type AccessLevel =
  | 'public' // Anyone can see
  | 'authenticated' // Has a valid Pod
  | 'government' // Pod domain is *.gov.uk
  | 'same-department' // Same department as profile owner
  | 'same-team'; // Same team as profile owner

/**
 * Profile fields organized by required access level
 */
export interface ProfileVisibility {
  public: (keyof PersonExtended)[];
  authenticated: (keyof PersonExtended)[];
  government: (keyof PersonExtended)[];
  sameDepartment: (keyof PersonExtended)[];
  sameTeam: (keyof PersonExtended)[];
}

/**
 * Extended person profile with protected fields
 */
export interface PersonExtended {
  // Public fields
  id: string;
  name: string;
  role: string;
  departmentId: string;
  teamId: string;
  skills: string[];
  maintains: string[];
  webId: string;
  photo?: string;

  // Government staff only
  email?: string;
  slack?: string;
  officeHours?: string;

  // Same department only
  calendar?: string;
  currentFocus?: string;
  availability?: string;

  // Same team only
  mobile?: string;
  homeWorkingDays?: string;
  escalationNotes?: string;
}

/**
 * Requester's identity extracted from their Pod
 */
export interface RequesterIdentity {
  webId: string;
  name?: string;
  departmentId?: string;
  teamId?: string;
  domain: string; // Extracted from webId URL
  isGovernment: boolean; // domain ends with .gov.uk
}

/**
 * Result of access control evaluation
 */
export interface AccessEvaluation {
  requester: RequesterIdentity;
  accessLevel: AccessLevel;
  visibleFields: string[];
  hiddenFields: string[];
  reason: string;
}

/**
 * Access audit log entry
 */
export interface AccessAuditEntry {
  timestamp: string;
  requesterWebId: string;
  requesterName?: string;
  requesterDepartment?: string;
  accessLevel: AccessLevel;
  fieldsRevealed: string[];
  fieldsDenied: string[];
}
