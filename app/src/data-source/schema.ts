/**
 * Wayfinder Demo Data Schema
 *
 * These TypeScript interfaces define the shape of our "believably fake"
 * government data. All entities use fictional names that parallel real
 * departments but are clearly synthetic.
 *
 * Domain: demo.gov.example (obviously fictional)
 * Dates: 2026+ (future dates signal demo status)
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Department {
  id: string;                    // e.g., "dcs" for Dept of Citizen Support
  name: string;                  // Full name
  acronym: string;               // e.g., "DCS"
  description: string;           // What this fictional dept does
  domain: string;                // e.g., "citizen-support.demo.gov.example"
  colour: string;                // Brand colour for graph visualisation
  teams: string[];               // Team IDs within this department
  established: string;           // Fictional date
}

export interface Team {
  id: string;                    // e.g., "puffin-team"
  name: string;                  // e.g., "Puffin Team"
  departmentId: string;          // Parent department
  description: string;           // What they do
  responsibilities: string[];    // Areas of ownership
  contact: string;               // Fictional email
  slack: string;                 // Fictional slack channel
  services: string[];            // Service IDs they maintain
}

export interface Service {
  id: string;                    // e.g., "citizen-eligibility-api"
  name: string;                  // Human-readable name
  type: ServiceType;
  departmentId: string;
  teamId: string;
  description: string;
  documentation: string;         // URL to fictional docs

  // API-specific fields
  endpoint?: string;             // Base URL
  version?: string;
  authentication?: AuthType[];

  // Relationships
  dependsOn: string[];           // Service IDs this consumes
  consumedBy: string[];          // Service IDs that consume this
  relatedPatterns: string[];     // Pattern IDs

  // Metadata
  status: ServiceStatus;
  lastUpdated: string;           // ISO date (2026+)
  monthlyRequests?: string;      // e.g., "2.5M"
  uptime?: string;               // e.g., "99.97%"

  // Tags for search
  tags: string[];
}

export type ServiceType =
  | 'api'
  | 'event-stream'
  | 'batch-service'
  | 'ui-component'
  | 'platform'
  | 'library';

export type ServiceStatus =
  | 'live'
  | 'beta'
  | 'alpha'
  | 'deprecated'
  | 'retired';

export type AuthType =
  | 'oauth2-client-credentials'
  | 'oauth2-authorization-code'
  | 'api-key'
  | 'mtls'
  | 'jwt-bearer';

// ============================================================================
// PATTERNS & KNOWLEDGE
// ============================================================================

export interface Pattern {
  id: string;                    // e.g., "async-eligibility-check"
  name: string;
  category: PatternCategory;
  description: string;
  problem: string;               // What problem does this solve?
  solution: string;              // How does it solve it?
  consequences: string[];        // Trade-offs

  // Usage
  implementedBy: string[];       // Service IDs using this pattern
  relatedPatterns: string[];     // Related pattern IDs

  // Content
  diagram?: string;              // Mermaid diagram
  codeExample?: CodeExample;

  // Metadata
  contributors: Contributor[];
  lastUpdated: string;
  tags: string[];
}

export type PatternCategory =
  | 'integration'
  | 'security'
  | 'data'
  | 'resilience'
  | 'messaging'
  | 'identity';

export interface CodeExample {
  language: string;
  code: string;
  description: string;
}

export interface Contributor {
  teamId: string;
  contribution: string;          // What they added
  date: string;
}

// ============================================================================
// GRAPH RELATIONSHIPS
// ============================================================================

export interface Relationship {
  id: string;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationshipType: RelationshipType;
  metadata?: Record<string, unknown>;
}

export type EntityType =
  | 'department'
  | 'team'
  | 'service'
  | 'pattern';

export type RelationshipType =
  | 'maintains'          // team -> service
  | 'belongs-to'         // team -> department
  | 'consumes'           // service -> service
  | 'implements'         // service -> pattern
  | 'contributed-to'     // team -> pattern
  | 'related-to';        // any -> any

// ============================================================================
// SEARCH & DISCOVERY
// ============================================================================

export interface SearchResult {
  entityId: string;
  entityType: EntityType;
  title: string;
  snippet: string;
  relevanceScore: number;
  highlights: string[];
  breadcrumb: string;            // e.g., "DCS > Puffin Team > Eligibility API"
}

// ============================================================================
// SOLID POD INTEGRATION
// ============================================================================

/**
 * Person profile stored in a Solid Pod
 *
 * These represent government staff who maintain services.
 * In the demo, they're stored in local Solid Pods.
 * In production, each department would run their own Pod server.
 */
export interface Person {
  id: string;                    // e.g., "river-stone"
  webId: string;                 // Solid WebID URL
  name: string;                  // Display name
  departmentId: string;          // Which fictional department
  teamId: string;                // Primary team
  role: string;                  // Job title
  skills: string[];              // Technical skills
  email: string;                 // Fictional email
  maintains: string[];           // Service IDs they maintain
  photo?: string;                // Avatar URL (optional)
}

/**
 * Extended Team interface with Solid WebID
 */
export interface TeamWithSolid extends Team {
  webId: string;                 // Solid WebID for the team Pod
  members: string[];             // Person IDs (references to Person.id)
}

/**
 * Extended Service interface with Solid maintainer references
 */
export interface ServiceWithSolid extends Service {
  maintainerWebIds?: string[];   // WebIDs of people who maintain this
  teamWebId?: string;            // WebID of the owning team's Pod
}

/**
 * Extended Pattern contributor with WebID
 */
export interface ContributorWithSolid extends Contributor {
  personId?: string;             // Reference to Person.id
  webId?: string;                // Direct WebID link
}

// ============================================================================
// DEMO METADATA
// ============================================================================

export interface DemoDataset {
  version: string;
  generated: string;
  description: string;
  departments: Department[];
  teams: Team[];
  services: Service[];
  patterns: Pattern[];
  relationships: Relationship[];
  // Solid integration
  people?: Person[];
  teamsWithSolid?: TeamWithSolid[];
}

// ============================================================================
// SOLID POD CONFIGURATION
// ============================================================================

/**
 * Configuration for demo Pod server
 */
export interface PodServerConfig {
  baseUrl: string;               // e.g., "http://localhost:3002"
  provider: 'css' | 'ess';       // Community Solid Server or Enterprise
}

/**
 * Pod manifest for seeding demo data
 */
export interface PodManifest {
  podUrl: string;                // e.g., "http://localhost:3002/river-stone/"
  owner: string;                 // Person or team ID
  ownerType: 'person' | 'team';
  resources: PodResource[];
}

export interface PodResource {
  path: string;                  // e.g., "profile"
  contentType: 'text/turtle' | 'application/ld+json';
  content: string;               // The actual RDF content
}
