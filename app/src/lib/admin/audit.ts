/**
 * Audit Logging for Admin Actions
 *
 * Records all admin changes for compliance and debugging.
 */

import { db } from '@/lib/db';
import { auditLog } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

type AuditAction = 'create' | 'update' | 'delete';
type EntityType = 'service' | 'team' | 'department';

interface AuditEntry {
  userId: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}

/**
 * Log an admin action to the audit trail
 */
export function logAuditEntry(entry: AuditEntry): void {
  db.insert(auditLog).values({
    userId: entry.userId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    oldValue: entry.oldValue ? JSON.stringify(entry.oldValue) : null,
    newValue: entry.newValue ? JSON.stringify(entry.newValue) : null,
  }).run();
}

/**
 * Get audit history for an entity
 */
export function getAuditHistory(entityType: EntityType, entityId: string) {
  return db
    .select()
    .from(auditLog)
    .where(and(eq(auditLog.entityType, entityType), eq(auditLog.entityId, entityId)))
    .orderBy(desc(auditLog.createdAt))
    .all();
}
