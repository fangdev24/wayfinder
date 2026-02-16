/**
 * DSA Filtering Functions
 *
 * Filters Data Sharing Agreement lists and fields based on user identity.
 * Uses the RBAC layer for base permissions and ABAC policies for fine-grained access.
 *
 * @see rbac.ts for Layer 1 (RBAC) role checks
 * @see dsa-policies.ts for Layer 2 (ABAC) policy evaluation
 */

import type { DataSharingAgreement } from '@/data-source/schema';
import type { UnifiedIdentity, DSAResourceAttributes, AccessDecision } from './types';
import { checkRolePermission } from './rbac';
import { evaluateDSAAccess, canPotentiallyAccessDSAs } from './dsa-policies';

/**
 * Extended DSA with access metadata
 */
export interface FilteredDSA extends DataSharingAgreement {
  /** Whether this is read-only historical access to an expired DSA */
  isHistoricalAccess: boolean;

  /** Fields that were redacted (for audit purposes) */
  redactedFields?: string[];
}

/**
 * Result of filtering a DSA list
 */
export interface DSAFilterResult {
  /** Filtered list of DSAs the user can access */
  dsas: FilteredDSA[];

  /** Total count before filtering (for UI) */
  totalCount: number;

  /** Count after filtering */
  accessibleCount: number;

  /** Summary of filtering decisions */
  summary: {
    allowed: number;
    denied: number;
    historical: number;
  };
}

/**
 * Convert DataSharingAgreement to DSAResourceAttributes for policy evaluation
 */
function toDSAAttributes(dsa: DataSharingAgreement): DSAResourceAttributes {
  return {
    providingDepartmentId: dsa.providingDepartmentId,
    consumingDepartmentId: dsa.consumingDepartmentId,
    status: dsa.status,
    effectiveDate: dsa.effectiveDate,
    expiryDate: dsa.expiryDate,
    reviewDate: dsa.reviewDate,
    dataElements: dsa.dataElements,
    category: dsa.category,
  };
}

/**
 * Filter a list of DSAs based on user identity
 *
 * This is the main entry point for DSA access control.
 * Applies both RBAC and ABAC checks to each DSA.
 *
 * @param dsas - The full list of DSAs
 * @param identity - The user's identity
 * @returns Filtered DSA list with access metadata
 */
export function filterDSAList(
  dsas: DataSharingAgreement[],
  identity: UnifiedIdentity
): DSAFilterResult {
  const totalCount = dsas.length;

  // Quick pre-check: can this identity potentially access any DSAs?
  if (!canPotentiallyAccessDSAs(identity)) {
    return {
      dsas: [],
      totalCount,
      accessibleCount: 0,
      summary: { allowed: 0, denied: totalCount, historical: 0 },
    };
  }

  // Check RBAC permission for DSA queries
  const rbacCheck = checkRolePermission(identity.role, 'query', 'dsa');
  if (!rbacCheck.allowed) {
    return {
      dsas: [],
      totalCount,
      accessibleCount: 0,
      summary: { allowed: 0, denied: totalCount, historical: 0 },
    };
  }

  // Evaluate ABAC policies for each DSA
  const filteredDSAs: FilteredDSA[] = [];
  let allowed = 0;
  let denied = 0;
  let historical = 0;

  for (const dsa of dsas) {
    const attributes = toDSAAttributes(dsa);
    const evaluation = evaluateDSAAccess(identity, attributes);

    if (evaluation.allowed) {
      allowed++;
      if (evaluation.isHistoricalAccess) {
        historical++;
      }

      filteredDSAs.push({
        ...dsa,
        isHistoricalAccess: evaluation.isHistoricalAccess,
      });
    } else {
      denied++;
    }
  }

  return {
    dsas: filteredDSAs,
    totalCount,
    accessibleCount: allowed,
    summary: { allowed, denied, historical },
  };
}

/**
 * Check if a user can access a specific DSA
 *
 * @param dsa - The DSA to check
 * @param identity - The user's identity
 * @returns Access decision with full details
 */
export function canAccessDSA(
  dsa: DataSharingAgreement,
  identity: UnifiedIdentity
): AccessDecision {
  // Check RBAC permission first
  const rbacCheck = checkRolePermission(identity.role, 'read', 'dsa');
  if (!rbacCheck.allowed) {
    return {
      decision: 'DENY',
      reason: rbacCheck.reason,
      policiesEvaluated: [],
    };
  }

  // Evaluate ABAC policies
  const attributes = toDSAAttributes(dsa);
  const evaluation = evaluateDSAAccess(identity, attributes);

  return {
    decision: evaluation.allowed ? 'ALLOW' : 'DENY',
    reason: evaluation.reason,
    policiesEvaluated: evaluation.evaluations,
    isHistoricalAccess: evaluation.isHistoricalAccess,
  };
}

/**
 * Filter sensitive data elements based on identity
 *
 * Data elements (e.g., 'national-insurance-number', 'income-bands')
 * should only be visible to parties with legal basis.
 *
 * @param dsa - The DSA containing data elements
 * @param identity - The user's identity
 * @returns Filtered list of data elements
 */
export function filterDataElements(
  dsa: DataSharingAgreement,
  identity: UnifiedIdentity
): string[] {
  // Cross-gov analysts see all data elements
  if (identity.isCrossGov) {
    return dsa.dataElements;
  }

  // Check if user is party to the DSA
  const isParty =
    identity.departmentId === dsa.providingDepartmentId ||
    identity.departmentId === dsa.consumingDepartmentId;

  if (!isParty) {
    // Non-parties don't see specific data elements
    return [];
  }

  // Parties see all data elements (they have legal basis)
  return dsa.dataElements;
}

/**
 * Filter related policies based on identity
 *
 * Policy details may be sensitive for non-cross-gov users.
 *
 * @param dsa - The DSA containing related policies
 * @param identity - The user's identity
 * @returns Filtered list of policy IDs
 */
export function filterRelatedPolicies(
  dsa: DataSharingAgreement,
  identity: UnifiedIdentity
): string[] {
  // Cross-gov and department analysts can see related policies
  if (identity.isCrossGov || identity.role === 'department-analyst') {
    return dsa.relatedPolicies;
  }

  // Check if user is party to the DSA
  const isParty =
    identity.departmentId === dsa.providingDepartmentId ||
    identity.departmentId === dsa.consumingDepartmentId;

  if (isParty) {
    return dsa.relatedPolicies;
  }

  // Non-parties don't see policy links
  return [];
}

/**
 * Create a redacted version of a DSA for display
 *
 * Removes sensitive fields that the user shouldn't see,
 * replacing them with redaction markers.
 *
 * @param dsa - The full DSA
 * @param identity - The user's identity
 * @returns DSA with sensitive fields redacted
 */
export function redactDSAForDisplay(
  dsa: DataSharingAgreement,
  identity: UnifiedIdentity
): FilteredDSA {
  const redactedFields: string[] = [];

  // Filter data elements
  const visibleDataElements = filterDataElements(dsa, identity);
  if (visibleDataElements.length < dsa.dataElements.length) {
    redactedFields.push('dataElements');
  }

  // Filter related policies
  const visiblePolicies = filterRelatedPolicies(dsa, identity);
  if (visiblePolicies.length < dsa.relatedPolicies.length) {
    redactedFields.push('relatedPolicies');
  }

  // Check if legal basis should be visible
  const showLegalBasis =
    identity.isCrossGov ||
    identity.departmentId === dsa.providingDepartmentId ||
    identity.departmentId === dsa.consumingDepartmentId;

  return {
    ...dsa,
    dataElements: visibleDataElements,
    relatedPolicies: visiblePolicies,
    legalBasis: showLegalBasis ? dsa.legalBasis : '[Redacted]',
    isHistoricalAccess: dsa.status === 'expired',
    redactedFields: redactedFields.length > 0 ? redactedFields : undefined,
  };
}

/**
 * Get DSAs by provider or consumer department with access control
 *
 * @param dsas - All DSAs
 * @param departmentId - Department to filter by
 * @param asProvider - True to get DSAs where dept is provider, false for consumer
 * @param identity - The user's identity for access control
 * @returns Filtered DSAs
 */
export function getDSAsByDepartmentWithAccessControl(
  dsas: DataSharingAgreement[],
  departmentId: string,
  asProvider: boolean,
  identity: UnifiedIdentity
): DSAFilterResult {
  // First filter by department
  const departmentFiltered = dsas.filter((dsa) =>
    asProvider
      ? dsa.providingDepartmentId === departmentId
      : dsa.consumingDepartmentId === departmentId
  );

  // Then apply access control
  return filterDSAList(departmentFiltered, identity);
}

/**
 * Search DSAs with access control
 *
 * @param dsas - All DSAs
 * @param searchTerm - Search term to match against name/description
 * @param identity - The user's identity for access control
 * @returns Filtered DSAs matching search
 */
export function searchDSAsWithAccessControl(
  dsas: DataSharingAgreement[],
  searchTerm: string,
  identity: UnifiedIdentity
): DSAFilterResult {
  const lowerSearch = searchTerm.toLowerCase();

  // First search
  const searchMatched = dsas.filter(
    (dsa) =>
      dsa.name.toLowerCase().includes(lowerSearch) ||
      dsa.description.toLowerCase().includes(lowerSearch) ||
      dsa.category.toLowerCase().includes(lowerSearch)
  );

  // Then apply access control
  return filterDSAList(searchMatched, identity);
}
