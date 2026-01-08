/**
 * Cross-Government Policies
 *
 * Fictional policies that demonstrate cross-departmental coordination
 * challenges. These show how Wayfinder can help discover policy
 * interdependencies alongside technical documentation.
 *
 * Each policy affects multiple departments and relates to specific
 * digital services, creating the web of connections that makes
 * "joined up government" so challenging.
 */

import type { Policy } from './schema';

export const policies: Policy[] = [
  // ============================================================================
  // NET ZERO & ENVIRONMENT
  // ============================================================================
  {
    id: 'net-zero-digital',
    name: 'Net Zero Digital Infrastructure',
    category: 'environment',
    description:
      'Mandates that all government digital services measure and reduce their carbon footprint. ' +
      'Requires departments to report on data centre energy usage, optimize cloud workloads, ' +
      'and preference green hosting providers.',
    objectives: [
      'Reduce government digital carbon emissions by 50% by 2030',
      'Mandate green hosting for new services',
      'Require carbon reporting for all APIs with >1M monthly requests',
      'Establish cross-government green cloud procurement framework',
    ],
    leadDepartment: 'dso',
    affectedDepartments: ['dso', 'dcs', 'rts', 'bia', 'vla', 'nhds'],
    relatedServices: [
      'gov-cloud-platform',
      'api-gateway',
      'citizen-portal',
      'tax-calculation-engine',
    ],
    relatedPolicies: ['data-sharing-framework'],
    status: 'active',
    effectiveDate: '2026-04-01',
    reviewDate: '2027-04-01',
    legislationRef: 'https://www.legislation.gov.uk/ukpga/2008/27/contents',
    tags: ['net zero', 'carbon', 'sustainability', 'cloud', 'green IT', 'environment'],
  },

  // ============================================================================
  // DATA SHARING
  // ============================================================================
  {
    id: 'data-sharing-framework',
    name: 'Cross-Government Data Sharing Framework',
    category: 'data',
    description:
      'Establishes the legal basis and technical standards for sharing citizen data ' +
      'between government departments. Requires explicit consent management, audit trails, ' +
      'and standardised APIs for all inter-departmental data exchanges.',
    objectives: [
      'Enable secure data sharing while protecting citizen privacy',
      'Reduce duplicate data collection across departments',
      'Establish common data standards and APIs',
      'Implement consent management across all citizen services',
    ],
    leadDepartment: 'dso',
    affectedDepartments: ['dso', 'dcs', 'rts', 'bia', 'nhds'],
    relatedServices: [
      'data-exchange-api',
      'consent-management-platform',
      'citizen-data-vault',
      'eligibility-api',
      'income-verification-api',
    ],
    relatedPolicies: ['digital-identity-programme', 'welfare-data-reform'],
    status: 'active',
    effectiveDate: '2025-09-01',
    legislationRef: 'https://www.legislation.gov.uk/ukpga/2017/30/contents',
    tags: ['data sharing', 'GDPR', 'consent', 'API', 'interoperability', 'privacy'],
  },

  // ============================================================================
  // DIGITAL IDENTITY
  // ============================================================================
  {
    id: 'digital-identity-programme',
    name: 'Government Digital Identity Programme',
    category: 'identity',
    description:
      'Creates a unified approach to verifying citizen identity across government services. ' +
      'Mandates adoption of GOV.UK One Login for all citizen-facing services, with ' +
      'provisions for high-assurance identity proofing where required.',
    objectives: [
      'Single sign-on for all government services',
      'Reduce identity fraud in public services',
      'Eliminate redundant identity checks between departments',
      'Support multiple identity verification levels (low/medium/high)',
    ],
    leadDepartment: 'bia',
    affectedDepartments: ['bia', 'dcs', 'rts', 'vla', 'nhds'],
    relatedServices: [
      'identity-verification-api',
      'document-check-service',
      'biometric-verification-api',
      'citizen-portal',
      'driving-licence-service',
    ],
    relatedPolicies: ['data-sharing-framework'],
    status: 'active',
    effectiveDate: '2026-01-15',
    reviewDate: '2027-01-15',
    tags: ['identity', 'authentication', 'One Login', 'verification', 'citizen'],
  },

  // ============================================================================
  // WELFARE REFORM
  // ============================================================================
  {
    id: 'welfare-data-reform',
    name: 'Welfare Data Integration Reform',
    category: 'welfare',
    description:
      'Streamlines benefit eligibility checking by enabling real-time data sharing ' +
      'between DCS (benefits), RTS (income), and NHDS (health). Aims to reduce ' +
      'assessment times and eliminate the need for citizens to provide the same ' +
      'information multiple times.',
    objectives: [
      'Reduce benefit assessment time from weeks to days',
      'Automate income verification for 80% of claims',
      'Enable health data sharing for disability assessments (with consent)',
      'Create single view of citizen circumstances across departments',
    ],
    leadDepartment: 'dcs',
    affectedDepartments: ['dcs', 'rts', 'nhds', 'bia'],
    relatedServices: [
      'eligibility-api',
      'income-verification-api',
      'benefit-calculation-engine',
      'summary-care-record-api',
      'consent-management-platform',
    ],
    relatedPolicies: ['data-sharing-framework', 'digital-identity-programme'],
    status: 'consultation',
    effectiveDate: '2026-09-01',
    tags: ['welfare', 'benefits', 'income', 'health', 'assessment', 'automation'],
  },

  // ============================================================================
  // CYBERSECURITY
  // ============================================================================
  {
    id: 'secure-by-design',
    name: 'Secure by Design Framework',
    category: 'security',
    description:
      'Mandates NCSC security principles for all government digital services. ' +
      'Requires threat modelling, security testing, and continuous monitoring ' +
      'as part of service development and operation.',
    objectives: [
      'Embed security in all stages of service development',
      'Achieve Cyber Essentials Plus for all public-facing services',
      'Implement zero trust architecture across government',
      'Establish shared security operations capability',
    ],
    leadDepartment: 'dso',
    affectedDepartments: ['dso', 'dcs', 'rts', 'bia', 'vla', 'nhds'],
    relatedServices: [
      'api-gateway',
      'identity-verification-api',
      'gov-cloud-platform',
      'security-monitoring-platform',
    ],
    relatedPolicies: ['digital-identity-programme'],
    status: 'active',
    effectiveDate: '2025-04-01',
    legislationRef: 'https://www.ncsc.gov.uk/collection/device-security-guidance',
    tags: ['security', 'NCSC', 'cyber', 'zero trust', 'secure by design'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPolicyById(id: string): Policy | undefined {
  return policies.find((p) => p.id === id);
}

export function getPoliciesByDepartment(departmentId: string): Policy[] {
  return policies.filter(
    (p) => p.leadDepartment === departmentId || p.affectedDepartments.includes(departmentId)
  );
}

export function getPoliciesByCategory(category: string): Policy[] {
  return policies.filter((p) => p.category === category);
}

export function getPoliciesAffectingService(serviceId: string): Policy[] {
  return policies.filter((p) => p.relatedServices.includes(serviceId));
}

export function getRelatedPolicies(policyId: string): Policy[] {
  const policy = getPolicyById(policyId);
  if (!policy) return [];
  return policies.filter((p) => policy.relatedPolicies.includes(p.id));
}
