/**
 * Access Control Audit Logging
 *
 * NCSC-compliant audit logging for access control decisions.
 * Logs all access attempts with integrity verification.
 *
 * NCSC Requirements addressed:
 * - Principle 13: Audit information for security events
 * - Immutable logging with integrity hashes
 * - Structured format for SIEM integration
 *
 * @see types.ts for RBACAccessAuditEntry definition
 */

import { createHash, randomUUID } from 'crypto';
import type {
  UnifiedIdentity,
  AccessAction,
  ResourceType,
  RBACAccessAuditEntry,
  PolicyEvaluationResult,
} from './types';

/**
 * In-memory audit log for demo purposes
 *
 * In production, this would be replaced with:
 * - Database table (see schema suggestion below)
 * - SIEM integration (Splunk, ELK, etc.)
 * - Immutable log store (append-only)
 */
const auditLog: RBACAccessAuditEntry[] = [];

/**
 * Context for audit logging (passed from request handlers)
 */
export interface AuditContext {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

/**
 * Log an access control decision
 *
 * Creates an immutable audit entry with integrity hash.
 * The hash allows verification that the log hasn't been tampered with.
 *
 * @param identity - The user requesting access
 * @param action - The action being attempted
 * @param resourceType - The type of resource
 * @param resourceId - The specific resource ID
 * @param decision - Whether access was allowed or denied
 * @param reason - Human-readable reason for the decision
 * @param policies - Policies that were evaluated (optional)
 * @param context - Request context (IP, user agent, etc.)
 */
export function logAccessDecision(
  identity: UnifiedIdentity,
  action: AccessAction,
  resourceType: ResourceType,
  resourceId: string,
  decision: 'ALLOW' | 'DENY',
  reason: string,
  policies?: PolicyEvaluationResult[],
  context?: AuditContext
): RBACAccessAuditEntry {
  const timestamp = new Date().toISOString();
  const requestId = context?.requestId ?? randomUUID();

  // Create hash input for integrity verification
  // This allows detection of log tampering
  const hashInput = [
    timestamp,
    identity.userId,
    identity.role,
    action,
    resourceType,
    resourceId,
    decision,
    reason,
  ].join('|');

  const requestHash = createHash('sha256').update(hashInput).digest('hex');

  const entry: RBACAccessAuditEntry = {
    id: randomUUID(),
    timestamp,

    // Subject
    userId: identity.userId,
    userName: identity.name,
    userDepartment: identity.departmentId,
    userRole: identity.role,
    identitySource: identity.source,

    // Action
    action,

    // Resource
    resourceType,
    resourceId,

    // Decision
    decision,
    reason,
    policiesEvaluated: policies ? JSON.stringify(policies.map((p) => p.policyId)) : undefined,

    // Context
    ipAddress: context?.ipAddress,
    userAgent: context?.userAgent,
    requestId,

    // Integrity
    requestHash,
  };

  // Append to audit log (in-memory for demo)
  auditLog.push(entry);

  // In production, would also:
  // - Write to database
  // - Send to SIEM
  // - Trigger alerts for suspicious patterns

  return entry;
}

/**
 * Log a batch of access decisions (for list operations)
 *
 * When filtering a list of resources, log summary rather than
 * individual entries to avoid log spam.
 *
 * @param identity - The user requesting access
 * @param action - The action being attempted
 * @param resourceType - The type of resources
 * @param allowedCount - Number of resources access was allowed to
 * @param deniedCount - Number of resources access was denied to
 * @param context - Request context
 */
export function logBatchAccessDecision(
  identity: UnifiedIdentity,
  action: AccessAction,
  resourceType: ResourceType,
  allowedCount: number,
  deniedCount: number,
  context?: AuditContext
): RBACAccessAuditEntry {
  const reason = `Batch ${action}: ${allowedCount} allowed, ${deniedCount} denied`;

  return logAccessDecision(
    identity,
    action,
    resourceType,
    `batch:${allowedCount + deniedCount}`,
    allowedCount > 0 ? 'ALLOW' : 'DENY',
    reason,
    undefined,
    context
  );
}

/**
 * Get recent audit entries (for admin dashboard)
 *
 * @param limit - Maximum entries to return
 * @param filters - Optional filters
 * @returns Recent audit entries
 */
export function getRecentAuditEntries(
  limit: number = 100,
  filters?: {
    userId?: string;
    resourceType?: ResourceType;
    decision?: 'ALLOW' | 'DENY';
    since?: Date;
  }
): RBACAccessAuditEntry[] {
  let entries = [...auditLog];

  // Apply filters
  if (filters?.userId) {
    entries = entries.filter((e) => e.userId === filters.userId);
  }
  if (filters?.resourceType) {
    entries = entries.filter((e) => e.resourceType === filters.resourceType);
  }
  if (filters?.decision) {
    entries = entries.filter((e) => e.decision === filters.decision);
  }
  if (filters?.since) {
    const sinceTime = filters.since.getTime();
    entries = entries.filter((e) => new Date(e.timestamp).getTime() >= sinceTime);
  }

  // Sort by timestamp descending (most recent first)
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply limit
  return entries.slice(0, limit);
}

/**
 * Verify integrity of an audit entry
 *
 * Recalculates the hash and compares to stored hash.
 * If they don't match, the entry may have been tampered with.
 *
 * @param entry - The audit entry to verify
 * @returns Whether the entry passes integrity check
 */
export function verifyAuditEntryIntegrity(entry: RBACAccessAuditEntry): boolean {
  const hashInput = [
    entry.timestamp,
    entry.userId,
    entry.userRole,
    entry.action,
    entry.resourceType,
    entry.resourceId,
    entry.decision,
    entry.reason,
  ].join('|');

  const calculatedHash = createHash('sha256').update(hashInput).digest('hex');

  return calculatedHash === entry.requestHash;
}

/**
 * Get audit statistics for a time period
 *
 * @param since - Start of time period
 * @param until - End of time period (defaults to now)
 * @returns Statistics summary
 */
export function getAuditStatistics(
  since: Date,
  until: Date = new Date()
): {
  totalDecisions: number;
  allowedCount: number;
  deniedCount: number;
  byResourceType: Record<string, { allowed: number; denied: number }>;
  byRole: Record<string, { allowed: number; denied: number }>;
  uniqueUsers: number;
} {
  const sinceTime = since.getTime();
  const untilTime = until.getTime();

  const relevantEntries = auditLog.filter((e) => {
    const entryTime = new Date(e.timestamp).getTime();
    return entryTime >= sinceTime && entryTime <= untilTime;
  });

  const byResourceType: Record<string, { allowed: number; denied: number }> = {};
  const byRole: Record<string, { allowed: number; denied: number }> = {};
  const uniqueUserIds = new Set<string>();

  let allowedCount = 0;
  let deniedCount = 0;

  for (const entry of relevantEntries) {
    // Count by decision
    if (entry.decision === 'ALLOW') {
      allowedCount++;
    } else {
      deniedCount++;
    }

    // Count by resource type
    if (!byResourceType[entry.resourceType]) {
      byResourceType[entry.resourceType] = { allowed: 0, denied: 0 };
    }
    byResourceType[entry.resourceType][entry.decision === 'ALLOW' ? 'allowed' : 'denied']++;

    // Count by role
    if (!byRole[entry.userRole]) {
      byRole[entry.userRole] = { allowed: 0, denied: 0 };
    }
    byRole[entry.userRole][entry.decision === 'ALLOW' ? 'allowed' : 'denied']++;

    // Track unique users
    uniqueUserIds.add(entry.userId);
  }

  return {
    totalDecisions: relevantEntries.length,
    allowedCount,
    deniedCount,
    byResourceType,
    byRole,
    uniqueUsers: uniqueUserIds.size,
  };
}

/**
 * Clear audit log (for testing only)
 *
 * WARNING: This should never be used in production.
 * Audit logs must be retained per NCSC requirements.
 */
export function clearAuditLog(): void {
  if (process.env.NODE_ENV === 'test') {
    auditLog.length = 0;
  } else {
    console.warn('Attempted to clear audit log outside of test environment');
  }
}

/**
 * Export current audit log (for backup/archive)
 *
 * @returns Copy of all audit entries
 */
export function exportAuditLog(): RBACAccessAuditEntry[] {
  return [...auditLog];
}

/*
 * DATABASE SCHEMA SUGGESTION (for production)
 *
 * When moving to production, add this to lib/db/schema.ts:
 *
 * export const accessAuditLog = sqliteTable('access_audit_log', {
 *   id: text('id').primaryKey(),
 *   timestamp: text('timestamp').notNull(),
 *   userId: text('user_id').notNull(),
 *   userName: text('user_name'),
 *   userDepartment: text('user_department'),
 *   userRole: text('user_role').notNull(),
 *   identitySource: text('identity_source').notNull(),
 *   action: text('action').notNull(),
 *   resourceType: text('resource_type').notNull(),
 *   resourceId: text('resource_id').notNull(),
 *   decision: text('decision').notNull(),
 *   reason: text('reason').notNull(),
 *   policiesEvaluated: text('policies_evaluated'),
 *   ipAddress: text('ip_address'),
 *   userAgent: text('user_agent'),
 *   requestId: text('request_id').notNull(),
 *   requestHash: text('request_hash').notNull(),
 * });
 *
 * Indexes for common queries:
 * - CREATE INDEX idx_audit_user ON access_audit_log(userId);
 * - CREATE INDEX idx_audit_resource ON access_audit_log(resourceType, resourceId);
 * - CREATE INDEX idx_audit_timestamp ON access_audit_log(timestamp);
 * - CREATE INDEX idx_audit_decision ON access_audit_log(decision);
 */
