/**
 * Teams Business Logic
 *
 * CRUD operations for teams with audit logging.
 */

import { db } from '@/lib/db';
import {
  teams,
  teamResponsibilities,
  departments,
  services,
  type Team,
  type NewTeam,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { logAuditEntry } from './audit';

/**
 * Extended team type with related data
 */
export interface TeamWithRelations extends Team {
  responsibilities: string[];
  departmentName?: string;
  serviceCount: number;
}

/**
 * Get all teams with their related data
 */
export function getAllTeamsWithRelations(): TeamWithRelations[] {
  const allTeams = db.select().from(teams).all();

  return allTeams.map((team) => {
    const responsibilities = db
      .select()
      .from(teamResponsibilities)
      .where(eq(teamResponsibilities.teamId, team.id))
      .all();

    const dept = db.select().from(departments).where(eq(departments.id, team.departmentId)).all()[0];

    const teamServices = db.select().from(services).where(eq(services.teamId, team.id)).all();

    return {
      ...team,
      responsibilities: responsibilities.map((r) => r.responsibility),
      departmentName: dept?.name,
      serviceCount: teamServices.length,
    };
  });
}

/**
 * Get a single team by ID with related data
 */
export function getTeamById(id: string): TeamWithRelations | null {
  const teamList = db.select().from(teams).where(eq(teams.id, id)).all();

  if (teamList.length === 0) {
    return null;
  }

  const team = teamList[0];

  const responsibilities = db
    .select()
    .from(teamResponsibilities)
    .where(eq(teamResponsibilities.teamId, id))
    .all();

  const dept = db.select().from(departments).where(eq(departments.id, team.departmentId)).all()[0];

  const teamServices = db.select().from(services).where(eq(services.teamId, id)).all();

  return {
    ...team,
    responsibilities: responsibilities.map((r) => r.responsibility),
    departmentName: dept?.name,
    serviceCount: teamServices.length,
  };
}

/**
 * Create a new team
 */
export interface CreateTeamInput {
  id: string;
  name: string;
  departmentId: string;
  description: string;
  contact: string;
  slack: string;
  responsibilities?: string[];
}

export function createTeam(input: CreateTeamInput, userId: string): TeamWithRelations {
  // Insert main team record
  const newTeam: NewTeam = {
    id: input.id,
    name: input.name,
    departmentId: input.departmentId,
    description: input.description,
    contact: input.contact,
    slack: input.slack,
  };

  db.insert(teams).values(newTeam).run();

  // Insert responsibilities
  if (input.responsibilities) {
    for (const responsibility of input.responsibilities) {
      db.insert(teamResponsibilities).values({
        teamId: input.id,
        responsibility,
      }).run();
    }
  }

  // Log audit entry
  logAuditEntry({
    userId,
    action: 'create',
    entityType: 'team',
    entityId: input.id,
    newValue: input as unknown as Record<string, unknown>,
  });

  return getTeamById(input.id)!;
}

/**
 * Update an existing team
 */
export function updateTeam(
  id: string,
  input: Partial<CreateTeamInput>,
  userId: string
): TeamWithRelations | null {
  const existing = getTeamById(id);
  if (!existing) {
    return null;
  }

  // Update main team record
  db.update(teams)
    .set({
      name: input.name,
      departmentId: input.departmentId,
      description: input.description,
      contact: input.contact,
      slack: input.slack,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(teams.id, id))
    .run();

  // Update responsibilities (delete and re-insert)
  if (input.responsibilities !== undefined) {
    db.delete(teamResponsibilities).where(eq(teamResponsibilities.teamId, id)).run();
    for (const responsibility of input.responsibilities) {
      db.insert(teamResponsibilities).values({ teamId: id, responsibility }).run();
    }
  }

  // Log audit entry
  logAuditEntry({
    userId,
    action: 'update',
    entityType: 'team',
    entityId: id,
    oldValue: existing as unknown as Record<string, unknown>,
    newValue: input as unknown as Record<string, unknown>,
  });

  return getTeamById(id);
}

/**
 * Delete a team
 */
export function deleteTeam(id: string, userId: string): boolean {
  const existing = getTeamById(id);
  if (!existing) {
    return false;
  }

  // Check if team has services
  const teamServices = db.select().from(services).where(eq(services.teamId, id)).all();
  if (teamServices.length > 0) {
    throw new Error(`Cannot delete team: ${teamServices.length} services are assigned to this team`);
  }

  // Delete responsibilities
  db.delete(teamResponsibilities).where(eq(teamResponsibilities.teamId, id)).run();

  // Delete the team
  db.delete(teams).where(eq(teams.id, id)).run();

  // Log audit entry
  logAuditEntry({
    userId,
    action: 'delete',
    entityType: 'team',
    entityId: id,
    oldValue: existing as unknown as Record<string, unknown>,
  });

  return true;
}

/**
 * Get services for a team
 */
export function getTeamServices(teamId: string) {
  return db.select().from(services).where(eq(services.teamId, teamId)).all();
}
