/**
 * Drizzle ORM Schema for Wayfinder Admin
 *
 * SQLite database schema for Services, Teams, and Admin functionality.
 * Mirrors the TypeScript interfaces in data-source/schema.ts
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ============================================================================
// CORE ENTITIES
// ============================================================================

export const departments = sqliteTable('departments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  acronym: text('acronym').notNull().unique(),
  description: text('description').notNull(),
  domain: text('domain').notNull(),
  colour: text('colour').notNull(),
  established: text('established').notNull(),
  createdAt: text('created_at').default('datetime("now")'),
  updatedAt: text('updated_at').default('datetime("now")'),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  departmentId: text('department_id').notNull().references(() => departments.id),
  description: text('description').notNull(),
  contact: text('contact').notNull(),
  slack: text('slack').notNull(),
  createdAt: text('created_at').default('datetime("now")'),
  updatedAt: text('updated_at').default('datetime("now")'),
});

export const teamResponsibilities = sqliteTable('team_responsibilities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  responsibility: text('responsibility').notNull(),
});

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'api' | 'event-stream' | 'batch-service' | 'ui-component' | 'platform' | 'library'
  departmentId: text('department_id').notNull().references(() => departments.id),
  teamId: text('team_id').notNull().references(() => teams.id),
  description: text('description').notNull(),
  documentation: text('documentation').notNull(),
  endpoint: text('endpoint'),
  version: text('version'),
  status: text('status').notNull(), // 'live' | 'beta' | 'alpha' | 'deprecated' | 'retired'
  lastUpdated: text('last_updated').notNull(),
  monthlyRequests: text('monthly_requests'),
  uptime: text('uptime'),
  createdAt: text('created_at').default('datetime("now")'),
  updatedAt: text('updated_at').default('datetime("now")'),
});

export const serviceAuthentication = sqliteTable('service_authentication', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  authType: text('auth_type').notNull(), // 'oauth2-client-credentials' | 'oauth2-authorization-code' | 'api-key' | 'mtls' | 'jwt-bearer'
});

export const serviceDependencies = sqliteTable('service_dependencies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  dependsOnId: text('depends_on_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
});

export const serviceTags = sqliteTable('service_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  tag: text('tag').notNull(),
});

export const servicePatterns = sqliteTable('service_patterns', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  serviceId: text('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  patternId: text('pattern_id').notNull(),
});

// ============================================================================
// ADMIN & AUTH
// ============================================================================

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  departmentId: text('department_id').references(() => departments.id),
  role: text('role').notNull(), // 'super_admin' | 'department_admin' | 'editor' | 'viewer'
  createdAt: text('created_at').default('datetime("now")'),
  lastLogin: text('last_login'),
});

export const adminSessions = sqliteTable('admin_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => adminUsers.id, { onDelete: 'cascade' }),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default('datetime("now")'),
});

export const auditLog = sqliteTable('audit_log', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  action: text('action').notNull(), // 'create' | 'update' | 'delete'
  entityType: text('entity_type').notNull(), // 'service' | 'team'
  entityId: text('entity_id').notNull(),
  oldValue: text('old_value'), // JSON string
  newValue: text('new_value'), // JSON string
  createdAt: text('created_at').default('datetime("now")'),
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type NewAuditLogEntry = typeof auditLog.$inferInsert;

// Service type constants (matching data-source/schema.ts)
export const SERVICE_TYPES = [
  'api',
  'event-stream',
  'batch-service',
  'ui-component',
  'platform',
  'library',
] as const;

export const SERVICE_STATUSES = [
  'live',
  'beta',
  'alpha',
  'deprecated',
  'retired',
] as const;

export const AUTH_TYPES = [
  'oauth2-client-credentials',
  'oauth2-authorization-code',
  'api-key',
  'mtls',
  'jwt-bearer',
] as const;

export const ADMIN_ROLES = [
  'super_admin',
  'department_admin',
  'editor',
  'viewer',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];
export type AuthType = (typeof AUTH_TYPES)[number];
export type AdminRole = (typeof ADMIN_ROLES)[number];
