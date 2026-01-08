/**
 * Services Business Logic
 *
 * CRUD operations for services with audit logging.
 */

import { db } from '@/lib/db';
import {
  services,
  serviceAuthentication,
  serviceTags,
  servicePatterns,
  serviceDependencies,
  teams,
  departments,
  type Service,
  type NewService,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { logAuditEntry } from './audit';

/**
 * Extended service type with related data
 */
export interface ServiceWithRelations extends Service {
  authentication: string[];
  tags: string[];
  patterns: string[];
  dependencies: string[];
  teamName?: string;
  departmentName?: string;
}

/**
 * Get all services with their related data
 */
export function getAllServices(): ServiceWithRelations[] {
  const allServices = db.select().from(services).all();

  return allServices.map((service) => {
    const auth = db
      .select()
      .from(serviceAuthentication)
      .where(eq(serviceAuthentication.serviceId, service.id))
      .all();

    const tags = db
      .select()
      .from(serviceTags)
      .where(eq(serviceTags.serviceId, service.id))
      .all();

    const patterns = db
      .select()
      .from(servicePatterns)
      .where(eq(servicePatterns.serviceId, service.id))
      .all();

    const deps = db
      .select()
      .from(serviceDependencies)
      .where(eq(serviceDependencies.serviceId, service.id))
      .all();

    const team = db.select().from(teams).where(eq(teams.id, service.teamId)).all()[0];
    const dept = db.select().from(departments).where(eq(departments.id, service.departmentId)).all()[0];

    return {
      ...service,
      authentication: auth.map((a) => a.authType),
      tags: tags.map((t) => t.tag),
      patterns: patterns.map((p) => p.patternId),
      dependencies: deps.map((d) => d.dependsOnId),
      teamName: team?.name,
      departmentName: dept?.name,
    };
  });
}

/**
 * Get a single service by ID with related data
 */
export function getServiceById(id: string): ServiceWithRelations | null {
  const serviceList = db.select().from(services).where(eq(services.id, id)).all();

  if (serviceList.length === 0) {
    return null;
  }

  const service = serviceList[0];

  const auth = db
    .select()
    .from(serviceAuthentication)
    .where(eq(serviceAuthentication.serviceId, id))
    .all();

  const tags = db
    .select()
    .from(serviceTags)
    .where(eq(serviceTags.serviceId, id))
    .all();

  const patterns = db
    .select()
    .from(servicePatterns)
    .where(eq(servicePatterns.serviceId, id))
    .all();

  const deps = db
    .select()
    .from(serviceDependencies)
    .where(eq(serviceDependencies.serviceId, id))
    .all();

  const team = db.select().from(teams).where(eq(teams.id, service.teamId)).all()[0];
  const dept = db.select().from(departments).where(eq(departments.id, service.departmentId)).all()[0];

  return {
    ...service,
    authentication: auth.map((a) => a.authType),
    tags: tags.map((t) => t.tag),
    patterns: patterns.map((p) => p.patternId),
    dependencies: deps.map((d) => d.dependsOnId),
    teamName: team?.name,
    departmentName: dept?.name,
  };
}

/**
 * Create a new service
 */
export interface CreateServiceInput {
  id: string;
  name: string;
  type: string;
  departmentId: string;
  teamId: string;
  description: string;
  documentation: string;
  endpoint?: string;
  version?: string;
  status: string;
  lastUpdated: string;
  monthlyRequests?: string;
  uptime?: string;
  authentication?: string[];
  tags?: string[];
  patterns?: string[];
  dependencies?: string[];
}

export function createService(input: CreateServiceInput, userId: string): ServiceWithRelations {
  // Insert main service record
  const newService: NewService = {
    id: input.id,
    name: input.name,
    type: input.type,
    departmentId: input.departmentId,
    teamId: input.teamId,
    description: input.description,
    documentation: input.documentation,
    endpoint: input.endpoint,
    version: input.version,
    status: input.status,
    lastUpdated: input.lastUpdated,
    monthlyRequests: input.monthlyRequests,
    uptime: input.uptime,
  };

  db.insert(services).values(newService).run();

  // Insert related data
  if (input.authentication) {
    for (const authType of input.authentication) {
      db.insert(serviceAuthentication).values({
        serviceId: input.id,
        authType,
      }).run();
    }
  }

  if (input.tags) {
    for (const tag of input.tags) {
      db.insert(serviceTags).values({
        serviceId: input.id,
        tag,
      }).run();
    }
  }

  if (input.patterns) {
    for (const patternId of input.patterns) {
      db.insert(servicePatterns).values({
        serviceId: input.id,
        patternId,
      }).run();
    }
  }

  if (input.dependencies) {
    for (const dependsOnId of input.dependencies) {
      db.insert(serviceDependencies).values({
        serviceId: input.id,
        dependsOnId,
      }).run();
    }
  }

  // Log audit entry
  logAuditEntry({
    userId,
    action: 'create',
    entityType: 'service',
    entityId: input.id,
    newValue: input as unknown as Record<string, unknown>,
  });

  return getServiceById(input.id)!;
}

/**
 * Update an existing service
 */
export function updateService(
  id: string,
  input: Partial<CreateServiceInput>,
  userId: string
): ServiceWithRelations | null {
  const existing = getServiceById(id);
  if (!existing) {
    return null;
  }

  // Update main service record
  db.update(services)
    .set({
      name: input.name,
      type: input.type,
      departmentId: input.departmentId,
      teamId: input.teamId,
      description: input.description,
      documentation: input.documentation,
      endpoint: input.endpoint,
      version: input.version,
      status: input.status,
      lastUpdated: input.lastUpdated,
      monthlyRequests: input.monthlyRequests,
      uptime: input.uptime,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(services.id, id))
    .run();

  // Update related data (delete and re-insert)
  if (input.authentication !== undefined) {
    db.delete(serviceAuthentication).where(eq(serviceAuthentication.serviceId, id)).run();
    for (const authType of input.authentication) {
      db.insert(serviceAuthentication).values({ serviceId: id, authType }).run();
    }
  }

  if (input.tags !== undefined) {
    db.delete(serviceTags).where(eq(serviceTags.serviceId, id)).run();
    for (const tag of input.tags) {
      db.insert(serviceTags).values({ serviceId: id, tag }).run();
    }
  }

  if (input.patterns !== undefined) {
    db.delete(servicePatterns).where(eq(servicePatterns.serviceId, id)).run();
    for (const patternId of input.patterns) {
      db.insert(servicePatterns).values({ serviceId: id, patternId }).run();
    }
  }

  if (input.dependencies !== undefined) {
    db.delete(serviceDependencies).where(eq(serviceDependencies.serviceId, id)).run();
    for (const dependsOnId of input.dependencies) {
      db.insert(serviceDependencies).values({ serviceId: id, dependsOnId }).run();
    }
  }

  // Log audit entry
  logAuditEntry({
    userId,
    action: 'update',
    entityType: 'service',
    entityId: id,
    oldValue: existing as unknown as Record<string, unknown>,
    newValue: input as unknown as Record<string, unknown>,
  });

  return getServiceById(id);
}

/**
 * Delete a service
 */
export function deleteService(id: string, userId: string): boolean {
  const existing = getServiceById(id);
  if (!existing) {
    return false;
  }

  // Delete related data first (cascade should handle this, but being explicit)
  db.delete(serviceAuthentication).where(eq(serviceAuthentication.serviceId, id)).run();
  db.delete(serviceTags).where(eq(serviceTags.serviceId, id)).run();
  db.delete(servicePatterns).where(eq(servicePatterns.serviceId, id)).run();
  db.delete(serviceDependencies).where(eq(serviceDependencies.serviceId, id)).run();

  // Delete the service
  db.delete(services).where(eq(services.id, id)).run();

  // Log audit entry
  logAuditEntry({
    userId,
    action: 'delete',
    entityType: 'service',
    entityId: id,
    oldValue: existing as unknown as Record<string, unknown>,
  });

  return true;
}

/**
 * Get all teams (for dropdowns)
 */
export function getAllTeams() {
  return db.select().from(teams).all();
}

/**
 * Get all departments (for dropdowns)
 */
export function getAllDepartments() {
  return db.select().from(departments).all();
}
