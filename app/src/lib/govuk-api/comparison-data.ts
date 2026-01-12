/**
 * Comparison Data
 *
 * Static data defining the capability comparison between
 * api.gov.uk (current state) and Wayfinder (proposed state).
 *
 * This data drives the comparison dashboard UI.
 */

import type { CapabilityItem, DecisionQuestion, GovernanceGap } from './types';
import { services } from '@/data-source/services';
import { policies } from '@/data-source/policies';

/**
 * Capability matrix comparing api.gov.uk and Wayfinder features
 */
export const CAPABILITY_MATRIX: CapabilityItem[] = [
  // What they both have
  {
    name: 'API Catalogue',
    description: 'Searchable list of government APIs',
    govukStatus: 'available',
    wayfinderStatus: 'available',
    govukDetail: '1,791 APIs catalogued',
    wayfinderDetail: '79 services + enriched metadata',
    importance: 'high',
  },
  {
    name: 'Documentation Links',
    description: 'Links to API documentation hosted by departments',
    govukStatus: 'available',
    wayfinderStatus: 'available',
    govukDetail: 'Links to department-hosted docs',
    wayfinderDetail: 'Links plus inline patterns',
    importance: 'high',
  },
  {
    name: 'Provider/Department Info',
    description: 'Which organisation owns each API',
    govukStatus: 'available',
    wayfinderStatus: 'available',
    govukDetail: 'Provider name only',
    wayfinderDetail: 'Full department + team structure',
    importance: 'medium',
  },
  {
    name: 'Data Sovereignty',
    description: 'Departments control their own data',
    govukStatus: 'partial',
    wayfinderStatus: 'available',
    govukDetail: 'Docs hosted by depts, catalogue centralised',
    wayfinderDetail: 'Full sovereignty via Solid Pods',
    importance: 'high',
  },

  // What only Wayfinder has
  {
    name: 'Service Relationships',
    description: 'Which services depend on or consume other services',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'Not tracked',
    wayfinderDetail: 'Graph-based dependency mapping',
    importance: 'critical',
  },
  {
    name: 'Policy Governance',
    description: 'Which policies govern which services',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'Not tracked',
    wayfinderDetail: '5 policies, auditable links',
    importance: 'critical',
  },
  {
    name: 'Team Discovery',
    description: 'Find which team maintains a service',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'Email addresses only',
    wayfinderDetail: 'Structured team entities with Slack, members',
    importance: 'high',
  },
  {
    name: 'People/Expertise',
    description: 'Discover people with specific skills',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'Not available',
    wayfinderDetail: 'WebID-linked profiles with skills',
    importance: 'high',
  },
  {
    name: 'Architecture Patterns',
    description: 'Documented patterns for integration',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'Not available',
    wayfinderDetail: '18 patterns with code examples',
    importance: 'high',
  },
  {
    name: 'Agent Queryable',
    description: 'AI agents can query the catalogue programmatically',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'HTML only, must scrape',
    wayfinderDetail: 'Natural language + SPARQL',
    importance: 'critical',
  },
  {
    name: 'Access Control',
    description: 'Granular permissions on catalogue data',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'All public or nothing',
    wayfinderDetail: 'ACL per-field via Solid',
    importance: 'medium',
  },
  {
    name: 'Knowledge Graph',
    description: 'Visual exploration of service relationships',
    govukStatus: 'unavailable',
    wayfinderStatus: 'available',
    govukDetail: 'Alphabetical list only',
    wayfinderDetail: 'Interactive D3.js visualisation',
    importance: 'medium',
  },
];

/**
 * Decision framework questions for stakeholders
 */
export const DECISION_QUESTIONS: DecisionQuestion[] = [
  {
    id: 'agent-access',
    question: 'Should AI agents be able to query the cross-government API landscape?',
    context:
      'Modern development increasingly uses AI assistants. If they cannot query API information programmatically, developers must manually search and copy information.',
    yesOption: {
      title: 'Enable agent access',
      requires: [
        'Structured, machine-readable data',
        'Relationship graph between services',
        'Query endpoint (SPARQL or similar)',
      ],
      enables: [
        '"Who maintains this API?" answered instantly',
        '"What depends on X?" traversable',
        'Automated documentation generation',
        'Integration pattern suggestions',
      ],
    },
    noOption: {
      title: 'Continue with human-only access',
      continues: ['HTML-based browsing', 'Manual search across pages', 'Copy-paste workflows'],
      accepts: [
        'Agents cannot assist with API discovery',
        'Manual effort for cross-cutting queries',
        'No automated relationship analysis',
      ],
    },
  },
  {
    id: 'governance-visibility',
    question: 'Should services be linked to their governing policies?',
    context:
      'Currently, there is no systematic way to answer "Which policy governs this service?" or "Which services are not governed by any policy?"',
    yesOption: {
      title: 'Track policy governance',
      requires: [
        'Policy entities in the catalogue',
        'Service → Policy relationships',
        'Regular governance review process',
      ],
      enables: [
        'Compliance auditing in seconds',
        'Ungoverned service detection',
        'Policy impact analysis before changes',
        'Cross-department governance visibility',
      ],
    },
    noOption: {
      title: 'Continue without governance tracking',
      continues: [
        'Manual policy documentation',
        'Spreadsheet-based compliance tracking',
        'Ad-hoc governance reviews',
      ],
      accepts: [
        'Governance blind spots remain hidden',
        'No automated compliance checking',
        'Policy impact unknown until problems arise',
      ],
    },
  },
  {
    id: 'data-sovereignty',
    question: 'Should departments own their catalogue data (not just documentation)?',
    context:
      'api.gov.uk centralises catalogue data in a GitHub CSV. Departments host their own documentation but contribute metadata via pull requests to a central repository.',
    yesOption: {
      title: 'Federated data via Solid Pods',
      requires: [
        'Solid Pod infrastructure per department',
        'Agreed schema for interoperability',
        'Aggregation service for cross-government queries',
      ],
      enables: [
        'Real-time updates without PRs',
        'Granular access control per field',
        'Department autonomy over their data',
        'Reduced central coordination burden',
      ],
    },
    noOption: {
      title: 'Continue with centralised catalogue',
      continues: [
        'GitHub PR workflow for updates',
        'Central team manages catalogue',
        'All-or-nothing visibility',
      ],
      accepts: [
        'Update latency (PR review cycle)',
        'Central bottleneck for changes',
        'No field-level access control',
      ],
    },
  },
];

/**
 * Calculate governance gaps - services without policy coverage
 */
export function calculateGovernanceGaps(): GovernanceGap[] {
  const governedServiceIds = new Set(policies.flatMap((p) => p.relatedServices));

  const gaps: GovernanceGap[] = [];

  for (const service of services) {
    if (governedServiceIds.has(service.id)) continue;

    // Determine risk level based on service characteristics
    let riskLevel: GovernanceGap['riskLevel'] = 'low';
    let reason = 'No explicit policy governance';
    const suggestedPolicies: string[] = [];

    // High risk: handles personal/biometric data
    if (
      service.tags.some((t) =>
        ['biometric', 'identity', 'personal', 'citizen', 'patient'].includes(t.toLowerCase())
      ) ||
      service.name.toLowerCase().includes('biometric') ||
      service.name.toLowerCase().includes('facial') ||
      service.name.toLowerCase().includes('identity')
    ) {
      riskLevel = 'critical';
      reason = 'Handles sensitive personal/biometric data without explicit policy governance';
      suggestedPolicies.push('digital-identity-programme', 'data-sharing-framework');
    }
    // High risk: payment/financial
    else if (
      service.tags.some((t) => ['payment', 'financial', 'tax', 'money'].includes(t.toLowerCase())) ||
      service.name.toLowerCase().includes('pay') ||
      service.name.toLowerCase().includes('payment')
    ) {
      riskLevel = 'high';
      reason = 'Handles financial transactions without explicit policy governance';
      suggestedPolicies.push('secure-by-design');
    }
    // Medium risk: citizen-facing
    else if (
      service.tags.some((t) => ['citizen', 'public', 'portal'].includes(t.toLowerCase())) ||
      service.type === 'platform'
    ) {
      riskLevel = 'medium';
      reason = 'Citizen-facing service without explicit policy governance';
      suggestedPolicies.push('secure-by-design', 'net-zero-digital');
    }

    gaps.push({
      serviceId: service.id,
      serviceName: service.name,
      riskLevel,
      reason,
      suggestedPolicies,
    });
  }

  // Sort by risk level
  const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  gaps.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

  return gaps;
}

/**
 * Get governance coverage statistics
 */
export function getGovernanceCoverage() {
  const governedServiceIds = new Set(policies.flatMap((p) => p.relatedServices));
  const total = services.length;
  const governed = services.filter((s) => governedServiceIds.has(s.id)).length;

  return {
    total,
    governed,
    ungoverned: total - governed,
    coveragePercent: Math.round((governed / total) * 100),
  };
}

/**
 * Count capabilities by status
 */
export function getCapabilitySummary() {
  const govukAvailable = CAPABILITY_MATRIX.filter((c) => c.govukStatus === 'available').length;
  const govukPartial = CAPABILITY_MATRIX.filter((c) => c.govukStatus === 'partial').length;
  const wayfinderAvailable = CAPABILITY_MATRIX.filter(
    (c) => c.wayfinderStatus === 'available'
  ).length;

  return {
    total: CAPABILITY_MATRIX.length,
    govuk: {
      available: govukAvailable,
      partial: govukPartial,
      unavailable: CAPABILITY_MATRIX.length - govukAvailable - govukPartial,
    },
    wayfinder: {
      available: wayfinderAvailable,
      partial: 0,
      unavailable: CAPABILITY_MATRIX.length - wayfinderAvailable,
    },
  };
}
