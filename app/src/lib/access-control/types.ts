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
 * Access audit log entry (Pod-based)
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

// ============================================================================
// RBAC + ABAC Hybrid Access Control Types
// ============================================================================

/**
 * RBAC Roles (ordered by privilege level)
 *
 * - public-viewer: Unauthenticated users, public catalogue only
 * - department-member: Staff within a department, own department data
 * - department-analyst: Data analysts, cross-dept where party to DSA
 * - cross-gov-analyst: Central function (Cabinet Office, CDDO, GDS), full visibility
 * - platform-admin: Technical administrators, system config only
 */
export type Role =
  | 'public-viewer'
  | 'department-member'
  | 'department-analyst'
  | 'cross-gov-analyst'
  | 'platform-admin';

/**
 * Central government departments with cross-government access privileges
 */
export const CROSS_GOV_DEPARTMENTS = ['cabinet-office', 'cddo', 'gds', 'dso'] as const;
export type CrossGovDepartment = (typeof CROSS_GOV_DEPARTMENTS)[number];

/**
 * Resource types that can be access-controlled
 */
export type ResourceType =
  | 'dsa'
  | 'service'
  | 'team'
  | 'person'
  | 'agent'
  | 'pattern'
  | 'policy'
  | 'department';

/**
 * Actions that can be performed on resources
 */
export type AccessAction = 'read' | 'list' | 'query' | 'create' | 'update' | 'delete';

/**
 * Department scope for RBAC evaluation
 */
export type DepartmentScope =
  | 'none' // No department access (public)
  | 'own' // Own department only
  | 'party' // Departments where user is party to DSA
  | 'all' // All departments (cross-gov)
  | 'admin'; // Admin operations only

/**
 * Unified identity combining Pod identity and admin session identity
 * This allows the access control system to work with both authentication sources
 */
export interface UnifiedIdentity {
  /** Source of identity verification */
  source: 'pod' | 'session';

  /** Unique user identifier (WebID or admin user ID) */
  userId: string;

  /** User's display name */
  name?: string;

  /** User's department ID - key attribute for DSA filtering */
  departmentId?: string;

  /** User's team ID (for same-team access) */
  teamId?: string;

  /** RBAC role determining base permissions */
  role: Role;

  /** Whether user is government staff (*.gov.uk domain) */
  isGovernment: boolean;

  /** Whether user is from a cross-government department */
  isCrossGov: boolean;

  /** Domain extracted from identity (for Pod-based) */
  domain?: string;
}

/**
 * Role permission configuration
 */
export interface RolePermissions {
  /** Actions this role can perform */
  allowedActions: AccessAction[];

  /** Resource types this role can access */
  allowedResourceTypes: ResourceType[];

  /** Department scope for this role */
  departmentScope: DepartmentScope;
}

/**
 * Result of checking a role's permission for an action
 */
export interface RolePermissionResult {
  allowed: boolean;
  reason: string;
}

/**
 * Result of evaluating ABAC policies
 */
export interface PolicyEvaluationResult {
  policyId: string;
  policyName: string;
  result: 'ALLOW' | 'DENY' | 'NOT_APPLICABLE';
  reason: string;
}

/**
 * Final access decision from combined RBAC + ABAC evaluation
 */
export interface AccessDecision {
  /** The final decision */
  decision: 'ALLOW' | 'DENY';

  /** Human-readable reason for the decision */
  reason: string;

  /** Policies that were evaluated */
  policiesEvaluated: PolicyEvaluationResult[];

  /** Fields that were filtered/redacted from response */
  filteredFields?: string[];

  /** Whether this is historical access to expired DSA */
  isHistoricalAccess?: boolean;
}

/**
 * NCSC-compliant access audit entry for the database
 */
export interface RBACAccessAuditEntry {
  id: string;
  timestamp: string;

  // Subject (who)
  userId: string;
  userName?: string;
  userDepartment?: string;
  userRole: Role;
  identitySource: 'pod' | 'session';

  // Action (what)
  action: AccessAction;

  // Resource (target)
  resourceType: ResourceType;
  resourceId: string;

  // Decision
  decision: 'ALLOW' | 'DENY';
  reason: string;
  policiesEvaluated?: string;

  // Context (NCSC requirement)
  ipAddress?: string;
  userAgent?: string;
  requestId: string;

  // Integrity (NCSC requirement)
  requestHash: string;
}

/**
 * DSA-specific resource attributes for ABAC evaluation
 */
export interface DSAResourceAttributes {
  providingDepartmentId: string;
  consumingDepartmentId: string;
  status: 'active' | 'draft' | 'expired' | 'under-review';
  effectiveDate: string;
  expiryDate?: string;
  reviewDate?: string;
  dataElements: string[];
  category: string;
}

/**
 * Helper to create a default public identity
 */
export function createPublicIdentity(): UnifiedIdentity {
  return {
    source: 'pod',
    userId: 'anonymous',
    role: 'public-viewer',
    isGovernment: false,
    isCrossGov: false,
  };
}

/**
 * Helper to check if a department is a cross-gov department
 */
export function isCrossGovDepartment(departmentId: string | undefined): boolean {
  if (!departmentId) return false;
  return CROSS_GOV_DEPARTMENTS.includes(departmentId as CrossGovDepartment);
}
