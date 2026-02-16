/**
 * RBAC (Role-Based Access Control) Layer
 *
 * Determines base permissions based on user role.
 * This is Layer 1 of the hybrid RBAC+ABAC system.
 *
 * @see types.ts for role definitions
 * @see dsa-policies.ts for Layer 2 (ABAC) policies
 */

import type {
  Role,
  RolePermissions,
  RolePermissionResult,
  AccessAction,
  ResourceType,
  DepartmentScope,
  UnifiedIdentity,
} from './types';
import { CROSS_GOV_DEPARTMENTS, isCrossGovDepartment } from './types';

/**
 * Role permission matrix - defines what each role can do
 *
 * This matrix is the foundation of the RBAC layer. Each role has:
 * - allowedActions: What operations they can perform
 * - allowedResourceTypes: What resources they can access
 * - departmentScope: How their access is scoped
 */
export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  'public-viewer': {
    allowedActions: ['read', 'list'],
    allowedResourceTypes: ['service', 'pattern', 'department'],
    departmentScope: 'none',
  },

  'department-member': {
    allowedActions: ['read', 'list', 'query'],
    allowedResourceTypes: ['service', 'team', 'person', 'pattern', 'dsa', 'department'],
    departmentScope: 'own',
  },

  'department-analyst': {
    allowedActions: ['read', 'list', 'query'],
    allowedResourceTypes: ['service', 'team', 'person', 'pattern', 'policy', 'dsa', 'agent', 'department'],
    departmentScope: 'party',
  },

  'cross-gov-analyst': {
    allowedActions: ['read', 'list', 'query'],
    allowedResourceTypes: ['service', 'team', 'person', 'pattern', 'policy', 'dsa', 'agent', 'department'],
    departmentScope: 'all',
  },

  'platform-admin': {
    allowedActions: ['read', 'list', 'create', 'update', 'delete'],
    allowedResourceTypes: ['service', 'team', 'department'],
    departmentScope: 'admin',
  },
};

/**
 * Check if a role has permission to perform an action on a resource type
 *
 * This is a fast, static check that doesn't consider resource attributes.
 * For attribute-based checks (e.g., DSA party check), see dsa-policies.ts.
 *
 * @param role - The user's role
 * @param action - The action being attempted
 * @param resourceType - The type of resource being accessed
 * @returns Permission result with allowed flag and reason
 */
export function checkRolePermission(
  role: Role,
  action: AccessAction,
  resourceType: ResourceType
): RolePermissionResult {
  const permissions = ROLE_PERMISSIONS[role];

  if (!permissions) {
    return {
      allowed: false,
      reason: `Unknown role: ${role}`,
    };
  }

  // Check if action is allowed for this role
  if (!permissions.allowedActions.includes(action)) {
    return {
      allowed: false,
      reason: `Role '${role}' cannot perform '${action}' actions`,
    };
  }

  // Check if resource type is allowed for this role
  if (!permissions.allowedResourceTypes.includes(resourceType)) {
    return {
      allowed: false,
      reason: `Role '${role}' cannot access '${resourceType}' resources`,
    };
  }

  return {
    allowed: true,
    reason: `Role '${role}' has permission to ${action} ${resourceType}`,
  };
}

/**
 * Get the department scope for a role
 *
 * This determines how data should be filtered by department:
 * - 'none': No access to department-scoped data
 * - 'own': Only own department's data
 * - 'party': Data where user's department is a party (e.g., DSAs)
 * - 'all': All data across departments
 * - 'admin': Admin operations only, not data access
 */
export function getRoleDepartmentScope(role: Role): DepartmentScope {
  return ROLE_PERMISSIONS[role]?.departmentScope ?? 'none';
}

/**
 * Admin role type from the existing database schema
 */
type AdminRole = 'super_admin' | 'department_admin' | 'editor' | 'viewer';

/**
 * Map existing admin roles to RBAC roles
 *
 * This bridges the existing admin session system with the new RBAC system.
 * Central department staff (Cabinet Office, CDDO, GDS) get elevated access.
 *
 * @param adminRole - The role from the admin users table
 * @param departmentId - The user's department ID
 * @returns The corresponding RBAC role
 */
export function mapAdminRoleToRBACRole(
  adminRole: AdminRole | string | null | undefined,
  departmentId: string | null | undefined
): Role {
  // Staff from central departments get cross-gov access regardless of admin role
  if (departmentId && isCrossGovDepartment(departmentId)) {
    // Super admins from central depts become platform admins
    if (adminRole === 'super_admin') {
      return 'platform-admin';
    }
    // Others from central depts become cross-gov analysts
    return 'cross-gov-analyst';
  }

  // Map based on admin role
  switch (adminRole) {
    case 'super_admin':
      return 'platform-admin';

    case 'department_admin':
      return 'department-analyst';

    case 'editor':
      return 'department-member';

    case 'viewer':
      return 'department-member';

    default:
      return 'public-viewer';
  }
}

/**
 * Create a UnifiedIdentity from an admin session user
 *
 * @param user - The user object from the admin session
 * @returns A UnifiedIdentity for access control evaluation
 */
export function createIdentityFromAdminUser(user: {
  id: string;
  name?: string | null;
  email?: string | null;
  departmentId?: string | null;
  role?: string | null;
}): UnifiedIdentity {
  const departmentId = user.departmentId ?? undefined;
  const role = mapAdminRoleToRBACRole(user.role, departmentId);

  return {
    source: 'session',
    userId: user.id,
    name: user.name ?? undefined,
    departmentId,
    role,
    isGovernment: true, // Admin users are government staff
    isCrossGov: isCrossGovDepartment(departmentId),
  };
}

/**
 * Determine the appropriate role from Pod-based identity
 *
 * Maps the existing AccessLevel (public, authenticated, government, etc.)
 * to RBAC roles for consistent handling.
 *
 * @param isGovernment - Whether the Pod domain is *.gov.uk
 * @param departmentId - The user's department if known
 * @param hasValidPod - Whether the user has a valid Pod identity
 * @returns The corresponding RBAC role
 */
export function mapPodIdentityToRole(
  isGovernment: boolean,
  departmentId: string | undefined,
  hasValidPod: boolean
): Role {
  if (!hasValidPod) {
    return 'public-viewer';
  }

  if (!isGovernment) {
    // Has Pod but not government - still public for now
    // Could be 'authenticated' level in future
    return 'public-viewer';
  }

  // Government user
  if (isCrossGovDepartment(departmentId)) {
    return 'cross-gov-analyst';
  }

  if (departmentId) {
    return 'department-member';
  }

  // Government but no department known
  return 'department-member';
}

/**
 * Check if identity can access resources from a specific department
 *
 * This is a quick check for department-level filtering before
 * applying more specific ABAC policies.
 *
 * @param identity - The user's identity
 * @param targetDepartmentId - The department ID of the resource
 * @returns Whether access is potentially allowed (still needs ABAC check)
 */
export function canAccessDepartment(
  identity: UnifiedIdentity,
  targetDepartmentId: string
): boolean {
  const scope = getRoleDepartmentScope(identity.role);

  switch (scope) {
    case 'all':
      return true;

    case 'own':
    case 'party':
      // For 'own' and 'party' scopes, need to check department match
      // 'party' scope requires additional DSA check (done in ABAC layer)
      return identity.departmentId === targetDepartmentId;

    case 'admin':
      // Admin scope is for management, not data access
      return false;

    case 'none':
    default:
      return false;
  }
}
