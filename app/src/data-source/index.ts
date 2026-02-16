/**
 * Wayfinder Demo Dataset
 *
 * This is the complete seed data for the Wayfinder demo.
 *
 * IMPORTANT: This data is intentionally fictional.
 * - Department names are invented parallels to real departments
 * - Team names use nature themes (obviously fake)
 * - Person names use nature themes (River, Ash, Slate...)
 * - Dates are in 2026 (clearly future/demo)
 * - Domain is demo.gov.example (reserved for documentation)
 *
 * The goal is "believably fake" - clearly synthetic but demonstrating
 * how the real system would work.
 *
 * Dataset Summary:
 * ================
 * - 6 Departments (DSO, DCS, RTS, BIA, VLA, NHDS)
 * - 23 Teams
 * - 24 People (with Solid Pod profiles)
 * - 75 Services (APIs, platforms, libraries, event streams)
 * - 18 Architecture Patterns
 * - 100+ Relationships
 *
 * Cross-Department Integrations:
 * ==============================
 * - DCS → RTS (income verification for benefits)
 * - DCS → BIA (identity verification for citizens)
 * - VLA → BIA (identity for licence applications)
 * - BIA → RTS (income checks for right-to-rent)
 * - All → DSO (shared platforms: gateway, notify, pay, design)
 *
 * Solid Pod Integration:
 * ======================
 * People and teams have WebIDs pointing to Solid Pods.
 * Demo uses localhost:3002, production would use department Pod servers.
 * This demonstrates decentralised identity - no central user database.
 */

import type { DemoDataset } from './schema';

import { departments } from './departments';
import { teams } from './teams';
import { services } from './services';
import { patterns } from './patterns';
import { policies } from './policies';
import { relationships } from './relationships';
import { people } from './people';
import { agents } from './agents';
import { dataSharingAgreements } from './data-sharing-agreements';

export const demoDataset: DemoDataset = {
  version: '1.3.0',
  generated: '2026-03-15T10:00:00Z',
  description:
    'Fictional cross-government knowledge graph with Solid Pod integration demonstrating the Wayfinder concept',
  departments,
  teams,
  services,
  patterns,
  policies,
  relationships,
  people,
  agents,
  dataSharingAgreements,
};

// Export individual collections
export { departments } from './departments';
export { teams } from './teams';
export { services, getServicesByDepartment, getServicesByTeam, getServiceById, getConsumers, getDependencies } from './services';
export { patterns } from './patterns';
export { policies, getPolicyById, getPoliciesByDepartment, getPoliciesByCategory, getPoliciesAffectingService, getRelatedPolicies } from './policies';
export { relationships } from './relationships';
export { people, getPersonById, getPersonByWebId, getPeopleByTeam, getPeopleByDepartment, getMaintainersForService } from './people';
export { agents, getAgentById, getAgentByWebId, getAgentsByDepartment, getAgentsByTeam, getAgentsByType, getAgentsConsumingService, getAgentsByStatus, searchAgents } from './agents';
export { dataSharingAgreements, getDataSharingAgreementById, getAgreementsByDepartment, getAgreementsByProvider, getAgreementsByConsumer, getAgreementsForService, getAgreementsByCategory, getAgreementsByStatus, searchAgreements } from './data-sharing-agreements';

// Export types
export type * from './schema';

// Default export is the complete dataset
export default demoDataset;

// ============================================================================
// DEMO STATISTICS
// ============================================================================

export const stats = {
  departments: departments.length,
  teams: teams.length,
  people: people.length,
  services: services.length,
  patterns: patterns.length,
  policies: policies.length,
  relationships: relationships.length,
  agents: agents.length,
  dataSharingAgreements: dataSharingAgreements.length,

  servicesByType: {
    api: services.filter((s) => s.type === 'api').length,
    platform: services.filter((s) => s.type === 'platform').length,
    library: services.filter((s) => s.type === 'library').length,
    eventStream: services.filter((s) => s.type === 'event-stream').length,
  },

  servicesByDepartment: {
    dso: services.filter((s) => s.departmentId === 'dso').length,
    dcs: services.filter((s) => s.departmentId === 'dcs').length,
    rts: services.filter((s) => s.departmentId === 'rts').length,
    bia: services.filter((s) => s.departmentId === 'bia').length,
    vla: services.filter((s) => s.departmentId === 'vla').length,
    nhds: services.filter((s) => s.departmentId === 'nhds').length,
  },

  crossDepartmentRelationships: relationships.filter(
    (r) => r.metadata && (r.metadata as Record<string, unknown>).crossDepartment
  ).length,

  patternsByCategory: {
    integration: patterns.filter((p) => p.category === 'integration').length,
    security: patterns.filter((p) => p.category === 'security').length,
    data: patterns.filter((p) => p.category === 'data').length,
    resilience: patterns.filter((p) => p.category === 'resilience').length,
    messaging: patterns.filter((p) => p.category === 'messaging').length,
    identity: patterns.filter((p) => p.category === 'identity').length,
  },

  peopleByDepartment: {
    dso: people.filter((p) => p.departmentId === 'dso').length,
    dcs: people.filter((p) => p.departmentId === 'dcs').length,
    rts: people.filter((p) => p.departmentId === 'rts').length,
    bia: people.filter((p) => p.departmentId === 'bia').length,
    vla: people.filter((p) => p.departmentId === 'vla').length,
    nhds: people.filter((p) => p.departmentId === 'nhds').length,
  },

  agentsByType: {
    discovery: agents.filter((a) => a.type === 'discovery').length,
    operations: agents.filter((a) => a.type === 'operations').length,
    compliance: agents.filter((a) => a.type === 'compliance').length,
    data: agents.filter((a) => a.type === 'data').length,
    intelligence: agents.filter((a) => a.type === 'intelligence').length,
    support: agents.filter((a) => a.type === 'support').length,
  },

  agentsByDepartment: {
    dso: agents.filter((a) => a.departmentId === 'dso').length,
    dcs: agents.filter((a) => a.departmentId === 'dcs').length,
    rts: agents.filter((a) => a.departmentId === 'rts').length,
    bia: agents.filter((a) => a.departmentId === 'bia').length,
    vla: agents.filter((a) => a.departmentId === 'vla').length,
    nhds: agents.filter((a) => a.departmentId === 'nhds').length,
  },

  agreementsByCategory: {
    income: dataSharingAgreements.filter((d) => d.category === 'income').length,
    identity: dataSharingAgreements.filter((d) => d.category === 'identity').length,
    health: dataSharingAgreements.filter((d) => d.category === 'health').length,
    benefits: dataSharingAgreements.filter((d) => d.category === 'benefits').length,
    address: dataSharingAgreements.filter((d) => d.category === 'address').length,
    employment: dataSharingAgreements.filter((d) => d.category === 'employment').length,
    other: dataSharingAgreements.filter((d) => d.category === 'other').length,
  },

  agreementsByStatus: {
    active: dataSharingAgreements.filter((d) => d.status === 'active').length,
    draft: dataSharingAgreements.filter((d) => d.status === 'draft').length,
    expired: dataSharingAgreements.filter((d) => d.status === 'expired').length,
    underReview: dataSharingAgreements.filter((d) => d.status === 'under-review').length,
  },
};

// ============================================================================
// SOLID POD CONFIGURATION
// ============================================================================

export const solidConfig = {
  // Demo Pod server (local)
  demoPodServer: 'http://localhost:3002',

  // Production Pod servers (fictional - per department)
  productionPodServers: {
    dso: 'https://pods.standards.demo.gov.example',
    dcs: 'https://pods.citizen-support.demo.gov.example',
    rts: 'https://pods.revenue.demo.gov.example',
    bia: 'https://pods.identity.demo.gov.example',
    vla: 'https://pods.vehicles.demo.gov.example',
    nhds: 'https://pods.health-data.demo.gov.example',
  },

  // Key demo WebIDs for testing (CSS 7.x uses /profile/card#me format)
  demoWebIds: {
    // Key people across departments
    riverStone: 'http://localhost:3002/river-stone/profile/card#me',
    ashMorgan: 'http://localhost:3002/ash-morgan/profile/card#me',
    slateWylder: 'http://localhost:3002/slate-wylder/profile/card#me',
    flintRivers: 'http://localhost:3002/flint-rivers/profile/card#me',
    heathWillows: 'http://localhost:3002/heath-willows/profile/card#me',

    // Key teams
    puffinTeam: 'http://localhost:3002/puffin-team/profile/card#team',
    graniteTeam: 'http://localhost:3002/granite-team/profile/card#team',
    wolfTeam: 'http://localhost:3002/wolf-team/profile/card#team',
  },
};

// ============================================================================
// SAMPLE SEARCH SCENARIOS
// ============================================================================

/**
 * These represent the kinds of questions Wayfinder should answer well.
 * Use these for demo scenarios and search testing.
 */
export const sampleQueries = [
  {
    query: 'How do I verify someone\'s identity before granting them access?',
    expectedResults: ['identity-verification-api', 'document-check-service', 'identity-proofing'],
    scenario: 'Developer needs identity verification',
  },
  {
    query: 'What APIs can I use to check if someone is eligible for benefits?',
    expectedResults: ['eligibility-api', 'income-verification-api', 'calculation-engine'],
    scenario: 'DCS developer building new service',
  },
  {
    query: 'How do other departments handle sending notifications to citizens?',
    expectedResults: ['gov-notify', 'async-notifications', 'webhook-patterns'],
    scenario: 'New team adopting shared platform',
  },
  {
    query: 'What pattern should I use for secure API authentication between services?',
    expectedResults: ['oauth2-client-credentials', 'mtls-everywhere', 'api-gateway-pattern'],
    scenario: 'Architect designing new integration',
  },
  {
    query: 'Who maintains the income verification API and how do I get access?',
    expectedResults: ['income-verification-api', 'kestrel-api', 'rts'],
    scenario: 'Finding the right team to contact',
  },
  {
    query: 'What services does the citizen portal depend on?',
    expectedResults: ['citizen-portal', 'design-system', 'gov-notify', 'gov-pay', 'identity-verification-api'],
    scenario: 'Understanding system dependencies',
  },
  {
    query: 'How do I share data with other departments securely?',
    expectedResults: ['data-exchange-api', 'data-sharing-agreements', 'consent-management'],
    scenario: 'Cross-department data sharing',
  },
  {
    query: 'What health data APIs are available?',
    expectedResults: ['fhir-api-platform', 'summary-care-record-api', 'electronic-prescription-api'],
    scenario: 'Health sector integration',
  },
];
