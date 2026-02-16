/**
 * DSA-Specific ABAC Policies
 *
 * Attribute-Based Access Control policies for Data Sharing Agreements.
 * This is Layer 2 of the hybrid RBAC+ABAC system.
 *
 * Policies are evaluated after RBAC permission check passes.
 * They determine fine-grained access based on DSA attributes.
 *
 * @see rbac.ts for Layer 1 (RBAC) role checks
 * @see dsa-filter.ts for applying policies to filter DSA lists
 */

import type {
  UnifiedIdentity,
  PolicyEvaluationResult,
  DSAResourceAttributes,
} from './types';

/**
 * Policy condition types for DSA access control
 */
export type DSAPolicyConditionType =
  | 'department-party' // User's dept must be provider or consumer
  | 'date-valid' // Current date within DSA validity period
  | 'status-active' // DSA status is ACTIVE
  | 'cross-gov-override'; // Central dept has override access

/**
 * Result of evaluating a policy condition
 */
interface ConditionResult {
  match: boolean;
  reason: string;
}

/**
 * Policy condition evaluator function signature
 */
type ConditionEvaluator = (
  identity: UnifiedIdentity,
  dsa: DSAResourceAttributes,
  params?: Record<string, unknown>
) => ConditionResult;

/**
 * Condition evaluators for each policy type
 *
 * These functions check specific attributes to determine access.
 * Each returns a match/no-match result with a human-readable reason.
 */
export const CONDITION_EVALUATORS: Record<DSAPolicyConditionType, ConditionEvaluator> = {
  /**
   * Department Party Check
   *
   * The user's department must be either the provider or consumer
   * of the Data Sharing Agreement to have access.
   */
  'department-party': (identity, dsa) => {
    if (!identity.departmentId) {
      return {
        match: false,
        reason: 'User has no department assigned',
      };
    }

    const isProvider = identity.departmentId === dsa.providingDepartmentId;
    const isConsumer = identity.departmentId === dsa.consumingDepartmentId;
    const isParty = isProvider || isConsumer;

    if (isParty) {
      const partyRole = isProvider ? 'provider' : 'consumer';
      return {
        match: true,
        reason: `User department '${identity.departmentId}' is the ${partyRole} of this DSA`,
      };
    }

    return {
      match: false,
      reason: `User department '${identity.departmentId}' is not a party to this DSA (provider: ${dsa.providingDepartmentId}, consumer: ${dsa.consumingDepartmentId})`,
    };
  },

  /**
   * Date Validity Check
   *
   * The current date must be within the DSA's validity period:
   * - On or after the effective date
   * - On or before the expiry date (if set)
   */
  'date-valid': (_identity, dsa) => {
    const now = new Date();
    const effectiveDate = new Date(dsa.effectiveDate);

    // Check if DSA has started
    if (now < effectiveDate) {
      return {
        match: false,
        reason: `DSA not yet effective (starts ${dsa.effectiveDate})`,
      };
    }

    // Check if DSA has expired
    if (dsa.expiryDate) {
      const expiryDate = new Date(dsa.expiryDate);
      if (now > expiryDate) {
        return {
          match: false,
          reason: `DSA has expired (ended ${dsa.expiryDate})`,
        };
      }
    }

    return {
      match: true,
      reason: 'Current date is within DSA validity period',
    };
  },

  /**
   * Status Active Check
   *
   * The DSA must have ACTIVE status for full access.
   * Supports optional param to allow expired status for historical viewing.
   */
  'status-active': (_identity, dsa, params) => {
    const allowExpired = params?.allowExpired === true;
    const allowedStatuses = allowExpired ? ['active', 'expired'] : ['active'];

    if (allowedStatuses.includes(dsa.status)) {
      return {
        match: true,
        reason: `DSA status '${dsa.status}' is acceptable`,
      };
    }

    return {
      match: false,
      reason: `DSA status '${dsa.status}' does not allow access (required: ${allowedStatuses.join(' or ')})`,
    };
  },

  /**
   * Cross-Government Override
   *
   * Users from central departments (Cabinet Office, CDDO, GDS, DSO)
   * have override access to all DSAs for governance purposes.
   */
  'cross-gov-override': (identity) => {
    if (identity.isCrossGov) {
      return {
        match: true,
        reason: `Cross-government analyst from '${identity.departmentId}' has override access`,
      };
    }

    return {
      match: false,
      reason: 'User is not a cross-government analyst',
    };
  },
};

/**
 * Policy definition structure
 */
interface DSAPolicy {
  id: string;
  name: string;
  description: string;
  priority: number; // Lower = evaluated first
  conditions: Array<{
    type: DSAPolicyConditionType;
    params?: Record<string, unknown>;
    required: boolean; // If true, condition must pass; if false, it's optional
  }>;
}

/**
 * DSA Access Policies
 *
 * Policies are evaluated in priority order (lowest first).
 * First policy with all required conditions matching wins.
 */
export const DSA_POLICIES: DSAPolicy[] = [
  // Policy 1: Cross-government override (highest priority - checked first)
  {
    id: 'dsa-cross-gov-override',
    name: 'Cross-Government Analyst Override',
    description: 'Cabinet Office/CDDO/GDS/DSO analysts can see all DSAs',
    priority: 1,
    conditions: [{ type: 'cross-gov-override', required: true }],
  },

  // Policy 2: Standard access for active DSAs
  {
    id: 'dsa-standard-access',
    name: 'Standard DSA Access',
    description: 'Department party access to active DSAs',
    priority: 10,
    conditions: [
      { type: 'department-party', required: true },
      { type: 'status-active', required: true },
      { type: 'date-valid', required: true },
    ],
  },

  // Policy 3: Historical access for expired DSAs (analysts only)
  {
    id: 'dsa-historical-access',
    name: 'Expired DSA Historical Access',
    description: 'Read-only access to expired DSAs for department parties',
    priority: 20,
    conditions: [
      { type: 'department-party', required: true },
      { type: 'status-active', params: { allowExpired: true }, required: true },
    ],
  },
];

/**
 * Evaluate a single policy against identity and DSA
 *
 * @param policy - The policy to evaluate
 * @param identity - The user's identity
 * @param dsa - The DSA attributes
 * @returns Policy evaluation result
 */
export function evaluatePolicy(
  policy: DSAPolicy,
  identity: UnifiedIdentity,
  dsa: DSAResourceAttributes
): PolicyEvaluationResult {
  const failedConditions: string[] = [];

  for (const condition of policy.conditions) {
    const evaluator = CONDITION_EVALUATORS[condition.type];
    if (!evaluator) {
      continue;
    }

    const result = evaluator(identity, dsa, condition.params);

    if (condition.required && !result.match) {
      failedConditions.push(`${condition.type}: ${result.reason}`);
    }
  }

  if (failedConditions.length === 0) {
    return {
      policyId: policy.id,
      policyName: policy.name,
      result: 'ALLOW',
      reason: policy.description,
    };
  }

  return {
    policyId: policy.id,
    policyName: policy.name,
    result: 'DENY',
    reason: failedConditions.join('; '),
  };
}

/**
 * Evaluate all DSA policies for a given identity and DSA
 *
 * Policies are evaluated in priority order. First ALLOW wins.
 * If no policy allows, returns DENY with combined reasons.
 *
 * @param identity - The user's identity
 * @param dsa - The DSA attributes
 * @returns Access decision with policy evaluation details
 */
export function evaluateDSAAccess(
  identity: UnifiedIdentity,
  dsa: DSAResourceAttributes
): {
  allowed: boolean;
  reason: string;
  evaluations: PolicyEvaluationResult[];
  isHistoricalAccess: boolean;
} {
  // Sort policies by priority (lowest first)
  const sortedPolicies = [...DSA_POLICIES].sort((a, b) => a.priority - b.priority);
  const evaluations: PolicyEvaluationResult[] = [];

  for (const policy of sortedPolicies) {
    const result = evaluatePolicy(policy, identity, dsa);
    evaluations.push(result);

    if (result.result === 'ALLOW') {
      return {
        allowed: true,
        reason: result.reason,
        evaluations,
        isHistoricalAccess: policy.id === 'dsa-historical-access',
      };
    }
  }

  // No policy allowed - combine denial reasons
  const denyReasons = evaluations
    .filter((e) => e.result === 'DENY')
    .map((e) => e.reason)
    .join('; ');

  return {
    allowed: false,
    reason: denyReasons || 'No applicable policy found',
    evaluations,
    isHistoricalAccess: false,
  };
}

/**
 * Quick check if identity can potentially access DSAs
 *
 * This is a fast pre-check before running full policy evaluation.
 * Used to determine if DSA queries should even be attempted.
 *
 * @param identity - The user's identity
 * @returns Whether DSA access is potentially possible
 */
export function canPotentiallyAccessDSAs(identity: UnifiedIdentity): boolean {
  // Cross-gov analysts always have access
  if (identity.isCrossGov) {
    return true;
  }

  // Must have a department to be party to any DSA
  if (!identity.departmentId) {
    return false;
  }

  // Department members and analysts can access their DSAs
  return ['department-member', 'department-analyst', 'cross-gov-analyst'].includes(identity.role);
}
