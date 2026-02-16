/**
 * Data Sharing Agreements Demo Data
 *
 * These represent formal data sharing arrangements between government
 * departments. They are the legal and governance layer that underpins
 * cross-departmental data flows shown in the service dependency graph.
 *
 * IMPORTANT: This data is intentionally fictional.
 * - Reference numbers are invented (DSA-YYYY-NNNN format)
 * - Legal bases reference real GDPR articles but in fictional contexts
 * - Data elements use realistic naming but are demonstrative only
 * - Dates are 2026+ to signal demo status
 */

import type { DataSharingAgreement, DataCategory, AgreementStatus } from './schema';

export const dataSharingAgreements: DataSharingAgreement[] = [
  // =========================================================================
  // DCS ← RTS: Income Verification for Benefits
  // =========================================================================
  {
    id: 'dsa-dcs-rts-income-2024',
    name: 'Income Verification for Benefit Eligibility',
    description:
      'Enables the Department of Citizen Support to verify income data from the Revenue and Taxation Service when processing benefit applications. This supports accurate eligibility assessment and reduces fraud.',

    providingDepartmentId: 'rts',
    consumingDepartmentId: 'dcs',

    reference: 'DSA-2024-0456',
    legalBasis: 'GDPR Article 6(1)(e) - Public task',
    category: 'income',
    status: 'active',

    dataElements: [
      'national-insurance-number',
      'income-bands',
      'employment-status',
      'employer-reference',
    ],

    relatedServices: ['income-verification-api', 'eligibility-api'],
    relatedPolicies: ['data-sharing-framework', 'welfare-data-reform'],

    effectiveDate: '2024-01-15',
    reviewDate: '2026-01-15',

    tags: ['income', 'benefits', 'eligibility', 'cross-department'],
  },

  // =========================================================================
  // DCS ← BIA: Identity Verification for Citizens
  // =========================================================================
  {
    id: 'dsa-bia-dcs-identity-2024',
    name: 'Identity Verification for Citizen Portal',
    description:
      'Allows the Department of Citizen Support to verify citizen identity through the Biometric Identity Agency when citizens access services through the portal. Ensures secure access to sensitive benefit information.',

    providingDepartmentId: 'bia',
    consumingDepartmentId: 'dcs',

    reference: 'DSA-2024-0789',
    legalBasis: 'GDPR Article 6(1)(e) - Public task',
    category: 'identity',
    status: 'active',

    dataElements: [
      'identity-verification-status',
      'document-validity',
      'biometric-match-score',
      'date-of-birth',
    ],

    relatedServices: ['identity-verification-api', 'citizen-portal'],
    relatedPolicies: ['digital-identity-programme', 'secure-by-design'],

    effectiveDate: '2024-03-01',
    reviewDate: '2026-03-01',

    tags: ['identity', 'verification', 'citizen-access', 'security'],
  },

  // =========================================================================
  // DCS ← NHDS: Health Data for Disability Assessments
  // =========================================================================
  {
    id: 'dsa-nhds-dcs-health-2024',
    name: 'Health Data for Disability Benefit Assessments',
    description:
      'Enables the Department of Citizen Support to access relevant health summary data from the National Health Data Service when processing disability benefit applications. Supports evidence-based assessments while protecting patient privacy.',

    providingDepartmentId: 'nhds',
    consumingDepartmentId: 'dcs',

    reference: 'DSA-2024-0234',
    legalBasis: 'GDPR Article 9(2)(h) - Health and social care',
    category: 'health',
    status: 'active',

    dataElements: [
      'health-condition-codes',
      'treatment-summary',
      'gp-registration-status',
      'medication-indicators',
    ],

    relatedServices: ['summary-care-record-api', 'case-management'],
    relatedPolicies: ['data-sharing-framework'],

    effectiveDate: '2024-06-01',
    reviewDate: '2026-06-01',

    tags: ['health', 'disability', 'assessment', 'sensitive-data'],
  },

  // =========================================================================
  // VLA ← BIA: Identity Checks for Licence Applications
  // =========================================================================
  {
    id: 'dsa-bia-vla-identity-2023',
    name: 'Identity Verification for Licence Applications',
    description:
      'Allows the Vehicle Licensing Agency to verify applicant identity through the Biometric Identity Agency when processing driving licence applications. Prevents fraudulent licence issuance.',

    providingDepartmentId: 'bia',
    consumingDepartmentId: 'vla',

    reference: 'DSA-2023-0567',
    legalBasis: 'GDPR Article 6(1)(e) - Public task',
    category: 'identity',
    status: 'active',

    dataElements: [
      'identity-verification-status',
      'photo-match-result',
      'document-authenticity',
      'address-verification',
    ],

    relatedServices: ['identity-verification-api', 'document-check-service'],
    relatedPolicies: ['digital-identity-programme'],

    effectiveDate: '2023-09-01',
    reviewDate: '2025-09-01',
    expiryDate: '2026-09-01',

    tags: ['identity', 'licensing', 'fraud-prevention'],
  },

  // =========================================================================
  // DCS ← RTS: Employment Status for Benefit Claims
  // =========================================================================
  {
    id: 'dsa-rts-dcs-employment-2024',
    name: 'Employment Status for Benefit Eligibility',
    description:
      'Enables the Department of Citizen Support to verify current employment status from the Revenue and Taxation Service real-time information feeds. Supports accurate benefit calculations based on current circumstances.',

    providingDepartmentId: 'rts',
    consumingDepartmentId: 'dcs',

    reference: 'DSA-2024-0891',
    legalBasis: 'GDPR Article 6(1)(e) - Public task',
    category: 'employment',
    status: 'under-review',

    dataElements: [
      'employment-status',
      'employer-reference',
      'start-date',
      'hours-worked-band',
    ],

    relatedServices: ['rti-processor', 'eligibility-api', 'employer-api'],
    relatedPolicies: ['welfare-data-reform', 'data-sharing-framework'],

    effectiveDate: '2024-04-01',
    reviewDate: '2026-04-01',

    tags: ['employment', 'benefits', 'real-time', 'eligibility'],
  },

  // =========================================================================
  // Cross-Government: DSO Standards and Guidance Sharing
  // =========================================================================
  {
    id: 'dsa-dso-all-standards-2023',
    name: 'Cross-Government Standards and Guidance',
    description:
      'Framework agreement enabling the Digital Standards Office to share technical standards, design patterns, and implementation guidance with all government departments. Supports consistent digital service delivery across government.',

    providingDepartmentId: 'dso',
    consumingDepartmentId: 'dcs', // Primary consumer, but available to all

    reference: 'DSA-2023-0001',
    legalBasis: 'GDPR Article 6(1)(e) - Public task',
    category: 'other',
    status: 'active',

    dataElements: [
      'api-specifications',
      'design-patterns',
      'security-standards',
      'accessibility-guidelines',
    ],

    relatedServices: ['api-gateway'],
    relatedPolicies: ['secure-by-design', 'digital-identity-programme'],

    effectiveDate: '2023-01-01',
    reviewDate: '2025-01-01',

    tags: ['standards', 'cross-government', 'technical', 'guidance'],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a data sharing agreement by ID
 */
export function getDataSharingAgreementById(id: string): DataSharingAgreement | undefined {
  return dataSharingAgreements.find((dsa) => dsa.id === id);
}

/**
 * Get all agreements where a department is either provider or consumer
 */
export function getAgreementsByDepartment(deptId: string): DataSharingAgreement[] {
  return dataSharingAgreements.filter(
    (dsa) => dsa.providingDepartmentId === deptId || dsa.consumingDepartmentId === deptId
  );
}

/**
 * Get agreements where a department provides data
 */
export function getAgreementsByProvider(deptId: string): DataSharingAgreement[] {
  return dataSharingAgreements.filter((dsa) => dsa.providingDepartmentId === deptId);
}

/**
 * Get agreements where a department consumes data
 */
export function getAgreementsByConsumer(deptId: string): DataSharingAgreement[] {
  return dataSharingAgreements.filter((dsa) => dsa.consumingDepartmentId === deptId);
}

/**
 * Get agreements linked to a specific service
 */
export function getAgreementsForService(serviceId: string): DataSharingAgreement[] {
  return dataSharingAgreements.filter((dsa) => dsa.relatedServices.includes(serviceId));
}

/**
 * Get agreements by data category
 */
export function getAgreementsByCategory(category: DataCategory): DataSharingAgreement[] {
  return dataSharingAgreements.filter((dsa) => dsa.category === category);
}

/**
 * Get agreements by status
 */
export function getAgreementsByStatus(status: AgreementStatus): DataSharingAgreement[] {
  return dataSharingAgreements.filter((dsa) => dsa.status === status);
}

/**
 * Search agreements by text query (searches name, description, tags, data elements)
 */
export function searchAgreements(query: string): DataSharingAgreement[] {
  const lowerQuery = query.toLowerCase();
  return dataSharingAgreements.filter(
    (dsa) =>
      dsa.name.toLowerCase().includes(lowerQuery) ||
      dsa.description.toLowerCase().includes(lowerQuery) ||
      dsa.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      dsa.dataElements.some((elem) => elem.toLowerCase().includes(lowerQuery)) ||
      dsa.reference.toLowerCase().includes(lowerQuery)
  );
}

export default dataSharingAgreements;
