/**
 * Data Migration Script
 *
 * Migrates hardcoded TypeScript data into SQLite database.
 * Run with: npx tsx scripts/migrate-data.ts
 */

import { db, initializeDatabase, closeDatabase } from '../src/lib/db';
import {
  departments as departmentsTable,
  teams as teamsTable,
  teamResponsibilities,
  services as servicesTable,
  serviceAuthentication,
  serviceDependencies,
  serviceTags,
  servicePatterns,
} from '../src/lib/db/schema';

// Import existing hardcoded data
import { departments } from '../src/data-source/departments';
import { teams } from '../src/data-source/teams';
import { services } from '../src/data-source/services';

async function migrate() {
  console.log('🚀 Starting data migration...\n');

  // Step 1: Initialize database tables
  console.log('📋 Creating database tables...');
  initializeDatabase();
  console.log('   ✓ Tables created\n');

  // Step 2: Migrate Departments
  console.log('🏛️  Migrating departments...');
  for (const dept of departments) {
    db.insert(departmentsTable).values({
      id: dept.id,
      name: dept.name,
      acronym: dept.acronym,
      description: dept.description,
      domain: dept.domain,
      colour: dept.colour,
      established: dept.established,
    }).run();
  }
  console.log(`   ✓ ${departments.length} departments migrated\n`);

  // Step 3: Migrate Teams and their responsibilities
  console.log('👥 Migrating teams...');
  for (const team of teams) {
    // Insert team
    db.insert(teamsTable).values({
      id: team.id,
      name: team.name,
      departmentId: team.departmentId,
      description: team.description,
      contact: team.contact,
      slack: team.slack,
    }).run();

    // Insert team responsibilities
    for (const responsibility of team.responsibilities) {
      db.insert(teamResponsibilities).values({
        teamId: team.id,
        responsibility,
      }).run();
    }
  }
  console.log(`   ✓ ${teams.length} teams migrated\n`);

  // Step 4: Migrate Services and related data
  console.log('🔧 Migrating services...');
  let authCount = 0;
  let tagCount = 0;
  let depCount = 0;
  let patternCount = 0;

  for (const service of services) {
    // Insert service
    db.insert(servicesTable).values({
      id: service.id,
      name: service.name,
      type: service.type,
      departmentId: service.departmentId,
      teamId: service.teamId,
      description: service.description,
      documentation: service.documentation,
      endpoint: service.endpoint,
      version: service.version,
      status: service.status,
      lastUpdated: service.lastUpdated,
      monthlyRequests: service.monthlyRequests,
      uptime: service.uptime,
    }).run();

    // Insert authentication types
    if (service.authentication) {
      for (const authType of service.authentication) {
        db.insert(serviceAuthentication).values({
          serviceId: service.id,
          authType,
        }).run();
        authCount++;
      }
    }

    // Insert tags
    for (const tag of service.tags) {
      db.insert(serviceTags).values({
        serviceId: service.id,
        tag,
      }).run();
      tagCount++;
    }

    // Insert related patterns
    for (const patternId of service.relatedPatterns) {
      db.insert(servicePatterns).values({
        serviceId: service.id,
        patternId,
      }).run();
      patternCount++;
    }
  }
  console.log(`   ✓ ${services.length} services migrated`);
  console.log(`   ✓ ${authCount} authentication entries`);
  console.log(`   ✓ ${tagCount} tags`);
  console.log(`   ✓ ${patternCount} pattern relationships\n`);

  // Step 5: Migrate service dependencies (second pass, after all services exist)
  console.log('🔗 Migrating service dependencies...');
  for (const service of services) {
    for (const depId of service.dependsOn) {
      // Check if the dependency service exists
      const depExists = services.some((s) => s.id === depId);
      if (depExists) {
        db.insert(serviceDependencies).values({
          serviceId: service.id,
          dependsOnId: depId,
        }).run();
        depCount++;
      } else {
        console.log(`   ⚠ Skipped missing dependency: ${service.id} -> ${depId}`);
      }
    }
  }
  console.log(`   ✓ ${depCount} dependencies migrated\n`);

  // Summary
  console.log('═══════════════════════════════════════');
  console.log('✅ Migration complete!');
  console.log('═══════════════════════════════════════');
  console.log(`   Departments: ${departments.length}`);
  console.log(`   Teams:       ${teams.length}`);
  console.log(`   Services:    ${services.length}`);
  console.log(`   Auth types:  ${authCount}`);
  console.log(`   Tags:        ${tagCount}`);
  console.log(`   Patterns:    ${patternCount}`);
  console.log(`   Dependencies: ${depCount}`);
  console.log('═══════════════════════════════════════\n');

  // Close database connection
  closeDatabase();
}

// Run migration
migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  closeDatabase();
  process.exit(1);
});
