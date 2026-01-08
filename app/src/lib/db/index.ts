/**
 * Database Connection Singleton
 *
 * Provides a single Drizzle ORM instance connected to the SQLite database.
 * Uses better-sqlite3 for synchronous SQLite operations.
 */

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Database file path - stored in app directory
const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), 'wayfinder.db');

// Create database connection singleton
let sqlite: Database.Database | null = null;

function getSqlite(): Database.Database {
  if (!sqlite) {
    sqlite = new Database(DB_PATH);
    sqlite.pragma('journal_mode = WAL'); // Better performance
    sqlite.pragma('foreign_keys = ON');  // Enforce foreign keys
  }
  return sqlite;
}

// Export the Drizzle instance
export const db = drizzle(getSqlite(), { schema });

// Export schema for use in queries
export * from './schema';

// SQL statements for table creation (used by migration script)
export const CREATE_TABLES_SQL = `
-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  acronym TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  colour TEXT NOT NULL,
  established TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department_id TEXT NOT NULL REFERENCES departments(id),
  description TEXT NOT NULL,
  contact TEXT NOT NULL,
  slack TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Team responsibilities
CREATE TABLE IF NOT EXISTS team_responsibilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  responsibility TEXT NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  department_id TEXT NOT NULL REFERENCES departments(id),
  team_id TEXT NOT NULL REFERENCES teams(id),
  description TEXT NOT NULL,
  documentation TEXT NOT NULL,
  endpoint TEXT,
  version TEXT,
  status TEXT NOT NULL,
  last_updated TEXT NOT NULL,
  monthly_requests TEXT,
  uptime TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Service authentication
CREATE TABLE IF NOT EXISTS service_authentication (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  auth_type TEXT NOT NULL
);

-- Service dependencies
CREATE TABLE IF NOT EXISTS service_dependencies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  depends_on_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  UNIQUE(service_id, depends_on_id)
);

-- Service tags
CREATE TABLE IF NOT EXISTS service_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Service patterns
CREATE TABLE IF NOT EXISTS service_patterns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  pattern_id TEXT NOT NULL
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department_id TEXT REFERENCES departments(id),
  role TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  last_login TEXT
);

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teams_department ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_services_department ON services(department_id);
CREATE INDEX IF NOT EXISTS idx_services_team ON services(team_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_service_tags_service ON service_tags(service_id);
CREATE INDEX IF NOT EXISTS idx_service_deps_service ON service_dependencies(service_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
`;

/**
 * Initialize the database with tables
 * Called once when the database is first created
 */
export function initializeDatabase(): void {
  const sqliteDb = getSqlite();
  // Execute all CREATE statements
  const statements = CREATE_TABLES_SQL.split(';').filter(s => s.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      sqliteDb.prepare(statement).run();
    }
  }
}

/**
 * Close database connection (for cleanup)
 */
export function closeDatabase(): void {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
  }
}
