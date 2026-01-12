/**
 * Wayfinder Demo Agents
 *
 * These are fictional AI/automation agents that demonstrate the agent
 * governance framework. Each agent has clear ownership, capabilities,
 * permissions, and audit requirements.
 *
 * Agent Types:
 * - discovery: Helps find information
 * - operations: Automates operational tasks
 * - compliance: Enforces policies
 * - data: Manages data flows
 * - intelligence: AI-powered analysis
 * - support: Departmental operations (comms, casework, private office)
 *
 * See ADR-003 for the full agent architecture specification.
 */

import type { Agent } from './schema';

export const agents: Agent[] = [
  // =========================================================================
  // Discovery Agents
  // =========================================================================
  {
    id: 'wayfinder-discovery',
    webId: 'http://localhost:3002/agents/wayfinder-discovery/profile/card#agent',
    name: 'Wayfinder Discovery Agent',
    type: 'discovery',
    departmentId: 'dso',
    teamId: 'granite-platform',
    description:
      'Powers natural language search across the Wayfinder knowledge base. Helps government teams find services, patterns, teams, and policies.',
    version: '1.0.0',
    sourceRepository: 'https://github.com/cabinet-office/wayfinder',
    capabilities: [
      {
        name: 'query_services',
        description: 'Search service catalogue',
        riskLevel: 'low',
        requiresApproval: false,
      },
      {
        name: 'query_people',
        description: 'Find team contacts',
        riskLevel: 'low',
        requiresApproval: false,
      },
      {
        name: 'query_patterns',
        description: 'Search pattern library',
        riskLevel: 'low',
        requiresApproval: false,
      },
    ],
    consumesServices: ['api-gateway', 'service-mesh', 'cloud-platform'],
    permissions: [
      { resource: '/services/*', actions: ['read'] },
      { resource: '/teams/*', actions: ['read'] },
      { resource: '/patterns/*', actions: ['read'] },
      { resource: '/policies/*', actions: ['read'] },
    ],
    status: 'active',
    createdAt: '2026-01-01',
    lastActiveAt: '2026-01-12',
    approvedBy: 'dso-sro',
    reviewDate: '2027-01-01',
    tags: ['discovery', 'search', 'nlp', 'wayfinder'],
  },

  // =========================================================================
  // Operations Agents
  // =========================================================================
  {
    id: 'deploy-bot-revenue',
    webId: 'http://localhost:3002/agents/deploy-bot-revenue/profile/card#agent',
    name: 'Revenue Platform Deploy Bot',
    type: 'operations',
    departmentId: 'rts',
    teamId: 'falcon-core',
    description:
      'Automated deployment agent for Revenue Platform services. Deploys to staging automatically, production requires approval.',
    version: '2.1.0',
    sourceRepository: 'https://github.com/rts-digital/deploy-bot',
    capabilities: [
      {
        name: 'deploy_staging',
        description: 'Deploy to staging environment',
        riskLevel: 'medium',
        requiresApproval: false,
      },
      {
        name: 'deploy_production',
        description: 'Deploy to production',
        riskLevel: 'high',
        requiresApproval: true,
      },
      {
        name: 'rollback',
        description: 'Rollback to previous version',
        riskLevel: 'high',
        requiresApproval: true,
      },
    ],
    consumesServices: ['cloud-platform', 'ci-cd-service', 'gov-notify'],
    permissions: [
      { resource: '/deployments/staging/*', actions: ['read', 'write', 'execute'] },
      {
        resource: '/deployments/production/*',
        actions: ['read', 'write', 'execute'],
        conditions: [{ type: 'approval_required', value: 'team-lead' }],
      },
    ],
    status: 'active',
    createdAt: '2025-06-15',
    lastActiveAt: '2026-01-11',
    approvedBy: 'rts-delivery-manager',
    reviewDate: '2026-06-15',
    tags: ['deployment', 'ci-cd', 'automation', 'revenue'],
  },

  // =========================================================================
  // Compliance Agents
  // =========================================================================
  {
    id: 'policy-enforcer',
    webId: 'http://localhost:3002/agents/policy-enforcer/profile/card#agent',
    name: 'Cross-Government Policy Enforcer',
    type: 'compliance',
    departmentId: 'dso',
    teamId: 'granite-platform',
    description:
      'Validates that services comply with active cross-government policies. Flags non-compliance for human review.',
    version: '1.2.0',
    sourceRepository: 'https://github.com/cabinet-office/policy-enforcer',
    capabilities: [
      {
        name: 'scan_services',
        description: 'Scan services for policy compliance',
        riskLevel: 'low',
        requiresApproval: false,
      },
      {
        name: 'flag_violation',
        description: 'Flag potential policy violations',
        riskLevel: 'medium',
        requiresApproval: false,
      },
      {
        name: 'block_deployment',
        description: 'Block non-compliant deployments',
        riskLevel: 'high',
        requiresApproval: true,
      },
    ],
    consumesServices: ['api-gateway', 'monitoring-stack', 'gov-notify'],
    permissions: [
      { resource: '/services/*', actions: ['read'] },
      { resource: '/policies/*', actions: ['read'] },
      { resource: '/compliance-flags/*', actions: ['read', 'write'] },
    ],
    status: 'active',
    createdAt: '2025-09-01',
    lastActiveAt: '2026-01-12',
    approvedBy: 'dso-sro',
    reviewDate: '2026-09-01',
    tags: ['compliance', 'policy', 'governance', 'enforcement'],
  },

  // =========================================================================
  // Support Services Agents
  // =========================================================================
  {
    id: 'ministerial-triage-dcs',
    webId: 'http://localhost:3002/agents/ministerial-triage-dcs/profile/card#agent',
    name: 'DCS Ministerial Correspondence Triage',
    type: 'support',
    departmentId: 'dcs',
    teamId: 'puffin-delivery',
    description:
      'Triages incoming ministerial correspondence for the Department of Citizen Support. Classifies by urgency (routine, priority, urgent, immediate), topic area, and suggests routing to appropriate policy team. All classifications reviewed by Private Office staff before action.',
    version: '1.0.0',
    sourceRepository: 'https://github.com/dcs-digital/ministerial-triage',
    capabilities: [
      {
        name: 'classify_correspondence',
        description: 'Classify incoming emails by urgency and topic',
        riskLevel: 'medium',
        requiresApproval: false,
      },
      {
        name: 'suggest_routing',
        description: 'Suggest which team should handle',
        riskLevel: 'low',
        requiresApproval: false,
      },
      {
        name: 'draft_acknowledgement',
        description: 'Draft acknowledgement response',
        riskLevel: 'medium',
        requiresApproval: true,
      },
      {
        name: 'flag_vip',
        description: 'Flag correspondence from MPs, peers, senior officials',
        riskLevel: 'low',
        requiresApproval: false,
      },
    ],
    consumesServices: ['gov-notify', 'citizen-data-platform', 'api-gateway', 'integration-hub'],
    permissions: [
      { resource: '/correspondence/inbox/*', actions: ['read'] },
      { resource: '/correspondence/classification/*', actions: ['read', 'write'] },
      {
        resource: '/correspondence/drafts/*',
        actions: ['write'],
        conditions: [{ type: 'approval_required', value: 'private-office-staff' }],
      },
    ],
    status: 'active',
    createdAt: '2026-02-01',
    lastActiveAt: '2026-01-12',
    approvedBy: 'dcs-perm-sec-office',
    reviewDate: '2026-08-01',
    tags: ['ministerial', 'correspondence', 'triage', 'private-office', 'comms'],
  },

  // =========================================================================
  // Cloned/Instanced Agents (demonstrate lineage)
  // =========================================================================
  {
    id: 'ministerial-triage-rts',
    webId: 'http://localhost:3002/agents/ministerial-triage-rts/profile/card#agent',
    name: 'RTS Ministerial Correspondence Triage',
    type: 'support',
    departmentId: 'rts',
    teamId: 'falcon-core',
    description:
      'Triages incoming ministerial correspondence for Revenue & Taxation Services. Cloned from the DCS agent and tuned for tax-related correspondence, with specialised classification for tax policy, appeals, and enforcement matters.',
    version: '1.0.0',
    sourceRepository: 'https://github.com/rts-digital/ministerial-triage',
    capabilities: [
      {
        name: 'classify_correspondence',
        description: 'Classify incoming emails by urgency and topic (tax-focused)',
        riskLevel: 'medium',
        requiresApproval: false,
      },
      {
        name: 'suggest_routing',
        description: 'Suggest routing to tax policy, appeals, or enforcement teams',
        riskLevel: 'low',
        requiresApproval: false,
      },
      {
        name: 'draft_acknowledgement',
        description: 'Draft acknowledgement response',
        riskLevel: 'medium',
        requiresApproval: true,
      },
      {
        name: 'flag_vip',
        description: 'Flag correspondence from MPs, peers, senior officials',
        riskLevel: 'low',
        requiresApproval: false,
      },
      {
        name: 'detect_taxpayer_distress',
        description: 'Flag cases indicating financial hardship (RTS-specific)',
        riskLevel: 'medium',
        requiresApproval: false,
      },
    ],
    consumesServices: ['gov-notify', 'citizen-data-platform', 'api-gateway', 'integration-hub'],
    permissions: [
      { resource: '/correspondence/inbox/*', actions: ['read'] },
      { resource: '/correspondence/classification/*', actions: ['read', 'write'] },
      {
        resource: '/correspondence/drafts/*',
        actions: ['write'],
        conditions: [{ type: 'approval_required', value: 'private-office-staff' }],
      },
    ],
    status: 'active',
    createdAt: '2026-03-15',
    lastActiveAt: '2026-01-12',
    approvedBy: 'rts-delivery-manager',
    reviewDate: '2026-09-15',
    // Lineage: cloned from the DCS ministerial triage agent
    clonedFrom: 'http://localhost:3002/agents/ministerial-triage-dcs/profile/card#agent',
    tags: ['ministerial', 'correspondence', 'triage', 'private-office', 'tax', 'rts'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get an agent by its ID
 */
export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id);
}

/**
 * Get an agent by its WebID
 */
export function getAgentByWebId(webId: string): Agent | undefined {
  return agents.find((agent) => agent.webId === webId);
}

/**
 * Get all agents owned by a specific department
 */
export function getAgentsByDepartment(departmentId: string): Agent[] {
  return agents.filter((agent) => agent.departmentId === departmentId);
}

/**
 * Get all agents owned by a specific team
 */
export function getAgentsByTeam(teamId: string): Agent[] {
  return agents.filter((agent) => agent.teamId === teamId);
}

/**
 * Get all agents of a specific type
 */
export function getAgentsByType(type: Agent['type']): Agent[] {
  return agents.filter((agent) => agent.type === type);
}

/**
 * Get all agents that consume a specific service
 */
export function getAgentsConsumingService(serviceId: string): Agent[] {
  return agents.filter((agent) => agent.consumesServices.includes(serviceId));
}

/**
 * Get all agents with a specific status
 */
export function getAgentsByStatus(status: Agent['status']): Agent[] {
  return agents.filter((agent) => agent.status === status);
}

/**
 * Search agents by keyword in name, description, or tags
 */
export function searchAgents(query: string): Agent[] {
  const lowerQuery = query.toLowerCase();
  return agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(lowerQuery) ||
      agent.description.toLowerCase().includes(lowerQuery) ||
      agent.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export default agents;
