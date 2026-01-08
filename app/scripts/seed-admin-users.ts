/**
 * Seed Admin Users Script
 *
 * Creates demo admin users for testing.
 * Run with: npx tsx scripts/seed-admin-users.ts
 */

import { db } from '../src/lib/db';
import { adminUsers } from '../src/lib/db/schema';

const demoAdmins = [
  {
    id: 'admin-super-1',
    email: 'super.admin@demo.gov.example',
    name: 'Sarah Thornton',
    departmentId: null,
    role: 'super_admin',
  },
  {
    id: 'admin-dso-1',
    email: 'dso.admin@demo.gov.example',
    name: 'James Fletcher',
    departmentId: 'dso',
    role: 'department_admin',
  },
  {
    id: 'admin-dcs-1',
    email: 'dcs.admin@demo.gov.example',
    name: 'Emma Richardson',
    departmentId: 'dcs',
    role: 'department_admin',
  },
  {
    id: 'admin-editor-1',
    email: 'editor@demo.gov.example',
    name: 'Michael Chen',
    departmentId: 'rts',
    role: 'editor',
  },
  {
    id: 'admin-viewer-1',
    email: 'viewer@demo.gov.example',
    name: 'Lisa Morgan',
    departmentId: null,
    role: 'viewer',
  },
];

async function seedAdminUsers() {
  console.log('🌱 Seeding admin users...\n');

  for (const admin of demoAdmins) {
    try {
      db.insert(adminUsers).values(admin).run();
      console.log(`   ✓ Created: ${admin.name} (${admin.email}) - ${admin.role}`);
    } catch (error: unknown) {
      // Handle unique constraint violation (user already exists)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('UNIQUE constraint failed')) {
        console.log(`   ⚠ Skipped (exists): ${admin.email}`);
      } else {
        throw error;
      }
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ Admin users seeded!');
  console.log('═══════════════════════════════════════');
  console.log('\nDemo credentials:');
  console.log('   Email: super.admin@demo.gov.example');
  console.log('   Password: demo123');
  console.log('');
  console.log('All demo accounts use password: demo123');
  console.log('═══════════════════════════════════════\n');
}

seedAdminUsers().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
