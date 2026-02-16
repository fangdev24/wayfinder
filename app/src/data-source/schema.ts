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
// POLICIES
// ============================================================================

/**
 * Cross-government policy that affects multiple departments
 *
 * Policies represent government initiatives, frameworks, or mandates
 * that span departmental boundaries. They link to the services and
 * departments they govern or enable.
 */
export interface Policy {
  id: string;                    // e.g., "net-zero-digital"
  name: string;                  // Human-readable name
  category: PolicyCategory;
  description: string;
  objectives: string[];          // What this policy aims to achieve

  // Relationships
  leadDepartment: string;        // Primary owning department ID
  affectedDepartments: string[]; // All departments affected
  relatedServices: string[];     // Service IDs this policy governs
  relatedPolicies: string[];     // Related policy IDs

  // Metadata
  status: PolicyStatus;
  effectiveDate: string;         // When the policy came into effect
  reviewDate?: string;           // Next review date
  legislationRef?: string;       // Reference to legislation.gov.uk

  // Tags for search
  tags: string[];
}

export type PolicyCategory =
  | 'digital'                    // Digital transformation policies
  | 'data'                       // Data sharing, governance
  | 'security'                   // Cybersecurity, NCSC guidance
  | 'identity'                   // Identity, authentication
  | 'environment'                // Net zero, sustainability
  | 'welfare';                   // Benefits, citizen support

export type PolicyStatus =
  | 'active'
  | 'consultation'
  | 'proposed'
  | 'superseded';

// ============================================================================
// AGENTS
// ============================================================================

/**
 * Agent type classifications for government AI/automation agents
 */
export type AgentType =
  | 'discovery'      // Helps find information
  | 'operations'     // Automates operations
  | 'compliance'     // Enforces policies
  | 'data'           // Manages data flows
  | 'intelligence'   // AI-powered analysis
  | 'support';       // Departmental operations (comms, casework, private office)

/**
 * Agent lifecycle status
 */
export type AgentStatus =
  | 'active'         // Running in production
  | 'testing'        // In testing/staging
  | 'suspended'      // Temporarily disabled
  | 'retired';       // No longer active

/**
 * A specific capability that an agent possesses
 */
export interface AgentCapability {
  name: string;                    // e.g., "deploy_to_staging"
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  requiresApproval: boolean;       // Needs human approval each time?
}

/**
 * Permission condition for scoped agent access
 */
export interface PermissionCondition {
  type: 'time_window' | 'approval_required' | 'rate_limit' | 'environment';
  value: string;
}

/**
 * Fine-grained permission granted to an agent
 */
export interface AgentPermission {
  resource: string;                // Path pattern, e.g., "/deployments/*"
  actions: ('read' | 'write' | 'delete' | 'execute')[];
  conditions?: PermissionCondition[];
}

/**
 * Agent identity - an autonomous entity that acts on behalf of a team
 *
 * Agents are first-class entities in Wayfinder, discoverable alongside
 * services, teams, and patterns. They have clear ownership, governance,
 * and audit trails.
 */
export interface Agent {
  id: string;                      // e.g., "deploy-bot-granite"
  webId: string;                   // Solid WebID for the agent
  name: string;                    // Human-readable name
  type: AgentType;

  // Ownership
  departmentId: string;            // Owning department
  teamId: string;                  // Owning team

  // Identity & Trust
  description: string;             // What this agent does
  version: string;                 // Agent version
  sourceRepository?: string;       // Where agent code lives

  // Capabilities
  capabilities: AgentCapability[]; // What this agent can do
  consumesServices: string[];      // Service IDs this agent uses

  // Permissions (scoped)
  permissions: AgentPermission[];  // Fine-grained permissions

  // Status
  status: AgentStatus;
  createdAt: string;
  lastActiveAt: string;

  // Lifecycle
  approvedBy: string;              // Who approved this agent
  reviewDate: string;              // Next review date

  // Lineage (for instanced/cloned agents)
  clonedFrom?: string;             // WebID of parent agent this was derived from

  // Tags for search
  tags: string[];
}

/**
 * Every agent action is logged for accountability
 */
export interface AgentAuditEntry {
  id: string;
  agentId: string;
  agentWebId: string;

  // What happened
  action: string;                  // e.g., "deployed", "read", "modified"
  resource: string;                // What was affected
  timestamp: string;

  // Context
  triggeredBy: 'schedule' | 'event' | 'human_request';
  requestedBy?: string;            // If human-triggered, who asked

  // Outcome
  outcome: 'success' | 'failure' | 'blocked';
  reason?: string;                 // Especially for blocked actions

  // Evidence
  inputHash?: string;              // Hash of inputs for reproducibility
  outputHash?: string;             // Hash of outputs
}

// ============================================================================
// DATA SHARING AGREEMENTS
// ============================================================================

/**
 * Categories of data that can be shared between departments
 */
export type DataCategory =
  | 'income'       // Income, earnings, tax data
  | 'identity'     // Identity verification data
  | 'health'       // Health and medical data
  | 'benefits'     // Benefit entitlement data
  | 'address'      // Address and location data
  | 'employment'   // Employment status data
  | 'other';       // Other data types

/**
 * Status of a data sharing agreement
 */
export type AgreementStatus =
  | 'active'       // Agreement is in force
  | 'draft'        // Under development
  | 'expired'      // Past expiry date
  | 'under-review'; // Being reviewed for renewal

/**
 * Formal data sharing agreement between government departments
 *
 * Data Sharing Agreements (DSAs) are the legal and governance layer
 * that underpins cross-departmental data flows. While Wayfinder shows
 * service-to-service dependencies, DSAs show the legal basis, data
 * elements, and parties involved in data sharing arrangements.
 */
export interface DataSharingAgreement {
  id: string;                        // e.g., "dsa-dcs-rts-income-2024"
  name: string;                      // Human-readable title
  description: string;               // Purpose and scope

  // Parties (using existing department IDs)
  providingDepartmentId: string;     // Who provides the data
  consumingDepartmentId: string;     // Who receives the data

  // Agreement details
  reference: string;                 // e.g., "DSA-2024-0456"
  legalBasis: string;                // e.g., "GDPR Article 6(1)(e)"
  category: DataCategory;
  status: AgreementStatus;

  // Data elements being shared
  dataElements: string[];            // e.g., ['national-insurance-number', 'income-bands']

  // Relationships (IDs only, following existing pattern)
  relatedServices: string[];         // Service IDs that implement this
  relatedPolicies: string[];         // Policy IDs it complies with

  // Lifecycle
  effectiveDate: string;             // ISO date
  reviewDate?: string;               // ISO date
  expiryDate?: string;               // ISO date

  // Metadata
  tags: string[];
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
  | 'pattern'
  | 'policy'
  | 'agent'
  | 'data-sharing-agreement';

export type RelationshipType =
  | 'maintains'          // team -> service
  | 'belongs-to'         // team -> department
  | 'consumes'           // service -> service, agent -> service
  | 'implements'         // service -> pattern
  | 'contributed-to'     // team -> pattern
  | 'related-to'         // any -> any
  | 'governs'            // policy -> service/department
  | 'requires'           // policy -> policy
  | 'owned-by'           // agent -> team
  | 'governed-by'        // agent -> policy
  | 'delegates-to'       // agent -> agent
  | 'reports-to'         // agent -> team
  | 'data-provider'      // data-sharing-agreement -> service (service provides data)
  | 'data-consumer'      // data-sharing-agreement -> service (service consumes data)
  | 'complies-with';     // data-sharing-agreement -> policy

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
  policies: Policy[];
  relationships: Relationship[];
  // Solid integration
  people?: Person[];
  teamsWithSolid?: TeamWithSolid[];
  // Agents
  agents?: Agent[];
  // Data Sharing Agreements
  dataSharingAgreements?: DataSharingAgreement[];
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
