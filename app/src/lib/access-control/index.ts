/**
 * Hybrid RBAC + ABAC Access Control
 *
 * Two-layer access control system:
 *
 * Layer 1 (RBAC): Role-based permission checking
 * - Determines base permissions from user role
 * - Fast, static checks
 *
 * Layer 2 (ABAC): Attribute-based policy evaluation
 * - Fine-grained access based on resource attributes
 * - DSA-specific rules (department party, date validity, etc.)
 *
 * Also includes:
 * - Pod-based identity (existing evaluator.ts)
 * - NCSC-compliant audit logging
 */

// Core types
export * from './types';

// Pod-based access control (existing)
export * from './evaluator';

// RBAC Layer
export {
  ROLE_PERMISSIONS,
  checkRolePermission,
  getRoleDepartmentScope,
  mapAdminRoleToRBACRole,
  createIdentityFromAdminUser,
  mapPodIdentityToRole,
  canAccessDepartment,
} from './rbac';

// ABAC Policies (DSA-specific)
export {
  CONDITION_EVALUATORS,
  DSA_POLICIES,
  evaluatePolicy,
  evaluateDSAAccess,
  canPotentiallyAccessDSAs,
} from './dsa-policies';

// DSA Filtering
export {
  filterDSAList,
  canAccessDSA,
  filterDataElements,
  filterRelatedPolicies,
  redactDSAForDisplay,
  getDSAsByDepartmentWithAccessControl,
  searchDSAsWithAccessControl,
  type FilteredDSA,
  type DSAFilterResult,
} from './dsa-filter';

// Audit Logging
export {
  logAccessDecision,
  logBatchAccessDecision,
  getRecentAuditEntries,
  verifyAuditEntryIntegrity,
  getAuditStatistics,
  exportAuditLog,
  type AuditContext,
} from './audit';
