import type { Relationship } from '../schema';

/**
 * Graph Relationships
 *
 * These define the connections that make the knowledge graph explorable.
 * Generated from the service dependencies but also includes additional
 * semantic relationships.
 */

export const relationships: Relationship[] = [
  // =========================================================================
  // TEAM -> DEPARTMENT (belongs-to)
  // =========================================================================
  // DSO
  { id: 'rel-001', sourceId: 'granite-platform', sourceType: 'team', targetId: 'dso', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-002', sourceId: 'cedar-design', sourceType: 'team', targetId: 'dso', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-003', sourceId: 'birch-notify', sourceType: 'team', targetId: 'dso', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-004', sourceId: 'willow-pay', sourceType: 'team', targetId: 'dso', targetType: 'department', relationshipType: 'belongs-to' },
  // DCS
  { id: 'rel-005', sourceId: 'puffin-delivery', sourceType: 'team', targetId: 'dcs', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-006', sourceId: 'cormorant-data', sourceType: 'team', targetId: 'dcs', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-007', sourceId: 'gannet-platform', sourceType: 'team', targetId: 'dcs', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-008', sourceId: 'tern-integration', sourceType: 'team', targetId: 'dcs', targetType: 'department', relationshipType: 'belongs-to' },
  // RTS
  { id: 'rel-009', sourceId: 'falcon-core', sourceType: 'team', targetId: 'rts', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-010', sourceId: 'kestrel-api', sourceType: 'team', targetId: 'rts', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-011', sourceId: 'merlin-data', sourceType: 'team', targetId: 'rts', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-012', sourceId: 'osprey-compliance', sourceType: 'team', targetId: 'rts', targetType: 'department', relationshipType: 'belongs-to' },
  // BIA
  { id: 'rel-013', sourceId: 'wolf-identity', sourceType: 'team', targetId: 'bia', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-014', sourceId: 'bear-border', sourceType: 'team', targetId: 'bia', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-015', sourceId: 'lynx-documents', sourceType: 'team', targetId: 'bia', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-016', sourceId: 'fox-biometrics', sourceType: 'team', targetId: 'bia', targetType: 'department', relationshipType: 'belongs-to' },
  // VLA
  { id: 'rel-017', sourceId: 'badger-registry', sourceType: 'team', targetId: 'vla', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-018', sourceId: 'otter-licensing', sourceType: 'team', targetId: 'vla', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-019', sourceId: 'hare-enquiries', sourceType: 'team', targetId: 'vla', targetType: 'department', relationshipType: 'belongs-to' },
  // NHDS
  { id: 'rel-020', sourceId: 'oak-records', sourceType: 'team', targetId: 'nhds', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-021', sourceId: 'elm-prescriptions', sourceType: 'team', targetId: 'nhds', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-022', sourceId: 'ash-integration', sourceType: 'team', targetId: 'nhds', targetType: 'department', relationshipType: 'belongs-to' },
  { id: 'rel-023', sourceId: 'maple-analytics', sourceType: 'team', targetId: 'nhds', targetType: 'department', relationshipType: 'belongs-to' },

  // =========================================================================
  // CROSS-DEPARTMENT SERVICE DEPENDENCIES (consumes)
  // These are the most interesting relationships for the graph
  // =========================================================================

  // DCS consuming DSO shared services
  { id: 'rel-100', sourceId: 'citizen-portal', sourceType: 'service', targetId: 'design-system', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'UI components' } },
  { id: 'rel-101', sourceId: 'citizen-portal', sourceType: 'service', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Citizen notifications' } },
  { id: 'rel-102', sourceId: 'citizen-portal', sourceType: 'service', targetId: 'gov-pay', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Fee payments' } },
  { id: 'rel-103', sourceId: 'eligibility-api', sourceType: 'service', targetId: 'api-gateway', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'External access' } },
  { id: 'rel-104', sourceId: 'case-management', sourceType: 'service', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Case notifications' } },

  // DCS consuming RTS services
  { id: 'rel-110', sourceId: 'eligibility-api', sourceType: 'service', targetId: 'income-verification-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Income checks for eligibility', crossDepartment: true } },
  { id: 'rel-111', sourceId: 'integration-hub', sourceType: 'service', targetId: 'income-verification-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Data exchange', crossDepartment: true } },

  // DCS consuming BIA services
  { id: 'rel-120', sourceId: 'citizen-portal', sourceType: 'service', targetId: 'identity-verification-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Identity checks', crossDepartment: true } },
  { id: 'rel-121', sourceId: 'integration-hub', sourceType: 'service', targetId: 'identity-verification-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Identity verification', crossDepartment: true } },

  // RTS consuming DSO services
  { id: 'rel-130', sourceId: 'rts-developer-portal', sourceType: 'service', targetId: 'design-system', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Portal UI' } },
  { id: 'rel-131', sourceId: 'income-verification-api', sourceType: 'service', targetId: 'api-gateway', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Cross-gov access' } },

  // BIA consuming DSO services
  { id: 'rel-140', sourceId: 'passport-application-api', sourceType: 'service', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Application notifications' } },
  { id: 'rel-141', sourceId: 'passport-application-api', sourceType: 'service', targetId: 'gov-pay', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Passport fees' } },
  { id: 'rel-142', sourceId: 'identity-verification-api', sourceType: 'service', targetId: 'api-gateway', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'External access' } },

  // BIA consuming BIA internal
  { id: 'rel-145', sourceId: 'right-to-work-api', sourceType: 'service', targetId: 'visa-status-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Visa status checks' } },
  { id: 'rel-146', sourceId: 'right-to-work-api', sourceType: 'service', targetId: 'document-check-service', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Document validation' } },
  { id: 'rel-147', sourceId: 'right-to-rent-api', sourceType: 'service', targetId: 'visa-status-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Immigration status' } },
  { id: 'rel-148', sourceId: 'right-to-rent-api', sourceType: 'service', targetId: 'income-verification-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Affordability checks', crossDepartment: true } },

  // VLA consuming DSO services
  { id: 'rel-150', sourceId: 'licence-application-api', sourceType: 'service', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Licence notifications' } },
  { id: 'rel-151', sourceId: 'licence-application-api', sourceType: 'service', targetId: 'gov-pay', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Licence fees' } },
  { id: 'rel-152', sourceId: 'vehicle-enquiry-api', sourceType: 'service', targetId: 'api-gateway', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Public API access' } },

  // VLA consuming BIA services
  { id: 'rel-155', sourceId: 'licence-application-api', sourceType: 'service', targetId: 'identity-verification-api', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Applicant identity', crossDepartment: true } },

  // NHDS consuming DSO services (less common, health is more isolated)
  { id: 'rel-160', sourceId: 'fhir-api-platform', sourceType: 'service', targetId: 'api-gateway', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'External supplier access' } },

  // =========================================================================
  // SERVICE -> PATTERN (implements)
  // =========================================================================
  { id: 'rel-200', sourceId: 'api-gateway', sourceType: 'service', targetId: 'api-gateway-pattern', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-201', sourceId: 'api-gateway', sourceType: 'service', targetId: 'oauth2-client-credentials', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-202', sourceId: 'api-gateway', sourceType: 'service', targetId: 'rate-limiting', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-203', sourceId: 'integration-hub', sourceType: 'service', targetId: 'event-driven-integration', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-204', sourceId: 'integration-hub', sourceType: 'service', targetId: 'circuit-breaker', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-205', sourceId: 'eligibility-api', sourceType: 'service', targetId: 'rules-engine', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-206', sourceId: 'eligibility-api', sourceType: 'service', targetId: 'circuit-breaker', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-207', sourceId: 'income-verification-api', sourceType: 'service', targetId: 'consent-management', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-208', sourceId: 'income-verification-api', sourceType: 'service', targetId: 'data-minimisation', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-209', sourceId: 'identity-verification-api', sourceType: 'service', targetId: 'identity-proofing', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-210', sourceId: 'identity-verification-api', sourceType: 'service', targetId: 'data-minimisation', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-211', sourceId: 'gov-pay', sourceType: 'service', targetId: 'idempotency-keys', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-212', sourceId: 'gov-notify', sourceType: 'service', targetId: 'async-notifications', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-213', sourceId: 'biometric-matching-api', sourceType: 'service', targetId: 'mtls-everywhere', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-214', sourceId: 'facial-recognition-service', sourceType: 'service', targetId: 'liveness-detection', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-215', sourceId: 'tax-calculation-engine', sourceType: 'service', targetId: 'rules-engine', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-216', sourceId: 'tax-calculation-engine', sourceType: 'service', targetId: 'audit-logging', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-217', sourceId: 'fhir-api-platform', sourceType: 'service', targetId: 'fhir-resources', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-218', sourceId: 'summary-care-record-api', sourceType: 'service', targetId: 'consent-management', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-219', sourceId: 'summary-care-record-api', sourceType: 'service', targetId: 'audit-logging', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-220', sourceId: 'design-system', sourceType: 'service', targetId: 'accessible-forms', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-221', sourceId: 'citizen-portal', sourceType: 'service', targetId: 'accessible-forms', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-222', sourceId: 'secrets-manager', sourceType: 'service', targetId: 'secrets-management', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-223', sourceId: 'delivery-receipts', sourceType: 'service', targetId: 'webhook-patterns', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-224', sourceId: 'data-exchange-api', sourceType: 'service', targetId: 'data-sharing-agreements', targetType: 'pattern', relationshipType: 'implements' },
  { id: 'rel-225', sourceId: 'data-exchange-api', sourceType: 'service', targetId: 'consent-management', targetType: 'pattern', relationshipType: 'implements' },

  // =========================================================================
  // TEAM -> PATTERN (contributed-to)
  // =========================================================================
  { id: 'rel-300', sourceId: 'granite-platform', sourceType: 'team', targetId: 'api-gateway-pattern', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-301', sourceId: 'granite-platform', sourceType: 'team', targetId: 'oauth2-client-credentials', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-302', sourceId: 'granite-platform', sourceType: 'team', targetId: 'secrets-management', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-303', sourceId: 'tern-integration', sourceType: 'team', targetId: 'event-driven-integration', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-304', sourceId: 'tern-integration', sourceType: 'team', targetId: 'circuit-breaker', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-305', sourceId: 'tern-integration', sourceType: 'team', targetId: 'consent-management', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-306', sourceId: 'kestrel-api', sourceType: 'team', targetId: 'data-minimisation', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-307', sourceId: 'wolf-identity', sourceType: 'team', targetId: 'identity-proofing', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-308', sourceId: 'wolf-identity', sourceType: 'team', targetId: 'data-minimisation', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-309', sourceId: 'fox-biometrics', sourceType: 'team', targetId: 'liveness-detection', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-310', sourceId: 'fox-biometrics', sourceType: 'team', targetId: 'mtls-everywhere', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-311', sourceId: 'cormorant-data', sourceType: 'team', targetId: 'rules-engine', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-312', sourceId: 'falcon-core', sourceType: 'team', targetId: 'rules-engine', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-313', sourceId: 'ash-integration', sourceType: 'team', targetId: 'fhir-resources', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-314', sourceId: 'oak-records', sourceType: 'team', targetId: 'consent-management', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-315', sourceId: 'cedar-design', sourceType: 'team', targetId: 'accessible-forms', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-316', sourceId: 'birch-notify', sourceType: 'team', targetId: 'async-notifications', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-317', sourceId: 'birch-notify', sourceType: 'team', targetId: 'webhook-patterns', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-318', sourceId: 'willow-pay', sourceType: 'team', targetId: 'idempotency-keys', targetType: 'pattern', relationshipType: 'contributed-to' },
  { id: 'rel-319', sourceId: 'osprey-compliance', sourceType: 'team', targetId: 'audit-logging', targetType: 'pattern', relationshipType: 'contributed-to' },

  // =========================================================================
  // PATTERN -> PATTERN (related-to)
  // =========================================================================
  { id: 'rel-400', sourceId: 'api-gateway-pattern', sourceType: 'pattern', targetId: 'oauth2-client-credentials', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-401', sourceId: 'api-gateway-pattern', sourceType: 'pattern', targetId: 'rate-limiting', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-402', sourceId: 'event-driven-integration', sourceType: 'pattern', targetId: 'circuit-breaker', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-403', sourceId: 'consent-management', sourceType: 'pattern', targetId: 'data-minimisation', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-404', sourceId: 'consent-management', sourceType: 'pattern', targetId: 'audit-logging', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-405', sourceId: 'consent-management', sourceType: 'pattern', targetId: 'data-sharing-agreements', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-406', sourceId: 'identity-proofing', sourceType: 'pattern', targetId: 'liveness-detection', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-407', sourceId: 'oauth2-client-credentials', sourceType: 'pattern', targetId: 'secrets-management', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-408', sourceId: 'mtls-everywhere', sourceType: 'pattern', targetId: 'secrets-management', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-409', sourceId: 'async-notifications', sourceType: 'pattern', targetId: 'webhook-patterns', targetType: 'pattern', relationshipType: 'related-to' },
  { id: 'rel-410', sourceId: 'idempotency-keys', sourceType: 'pattern', targetId: 'webhook-patterns', targetType: 'pattern', relationshipType: 'related-to' },
];

export default relationships;
