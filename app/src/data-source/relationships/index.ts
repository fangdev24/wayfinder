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

  // =========================================================================
  // AGENT -> TEAM (owned-by)
  // Every agent has a clear owning team for accountability
  // =========================================================================
  { id: 'rel-500', sourceId: 'wayfinder-discovery', sourceType: 'agent', targetId: 'granite-platform', targetType: 'team', relationshipType: 'owned-by' },
  { id: 'rel-501', sourceId: 'deploy-bot-revenue', sourceType: 'agent', targetId: 'falcon-core', targetType: 'team', relationshipType: 'owned-by' },
  { id: 'rel-502', sourceId: 'policy-enforcer', sourceType: 'agent', targetId: 'granite-platform', targetType: 'team', relationshipType: 'owned-by' },
  { id: 'rel-503', sourceId: 'ministerial-triage-dcs', sourceType: 'agent', targetId: 'puffin-delivery', targetType: 'team', relationshipType: 'owned-by' },

  // =========================================================================
  // AGENT -> SERVICE (consumes)
  // Agents consume services to perform their functions
  // =========================================================================

  // wayfinder-discovery consumes: neptune-graph, opensearch-index
  { id: 'rel-510', sourceId: 'wayfinder-discovery', sourceType: 'agent', targetId: 'neptune-graph', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Knowledge graph queries' } },
  { id: 'rel-511', sourceId: 'wayfinder-discovery', sourceType: 'agent', targetId: 'opensearch-index', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Full-text search' } },

  // deploy-bot-revenue consumes: gov-cloud-platform, github-actions, slack-notifications
  { id: 'rel-520', sourceId: 'deploy-bot-revenue', sourceType: 'agent', targetId: 'cloud-platform', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Deployment target' } },
  { id: 'rel-521', sourceId: 'deploy-bot-revenue', sourceType: 'agent', targetId: 'github-actions', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'CI/CD pipelines' } },
  { id: 'rel-522', sourceId: 'deploy-bot-revenue', sourceType: 'agent', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Deployment notifications' } },

  // policy-enforcer consumes: wayfinder-api, policy-registry, notification-service
  { id: 'rel-530', sourceId: 'policy-enforcer', sourceType: 'agent', targetId: 'api-gateway', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Service registry access' } },
  { id: 'rel-531', sourceId: 'policy-enforcer', sourceType: 'agent', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Compliance notifications' } },

  // ministerial-triage-dcs consumes: email-gateway, document-classification-api, bedrock-claude, staff-directory
  { id: 'rel-540', sourceId: 'ministerial-triage-dcs', sourceType: 'agent', targetId: 'gov-notify', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Email access via Notify' } },
  { id: 'rel-541', sourceId: 'ministerial-triage-dcs', sourceType: 'agent', targetId: 'case-management', targetType: 'service', relationshipType: 'consumes', metadata: { purpose: 'Correspondence routing' } },

  // =========================================================================
  // DATA SHARING AGREEMENT -> SERVICE (data-provider/data-consumer)
  // These show which services implement data sharing agreements
  // =========================================================================

  // DCS-RTS Income Verification Agreement
  { id: 'rel-600', sourceId: 'dsa-dcs-rts-income-2024', sourceType: 'data-sharing-agreement', targetId: 'income-verification-api', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'RTS provides income data', crossDepartment: true } },
  { id: 'rel-601', sourceId: 'dsa-dcs-rts-income-2024', sourceType: 'data-sharing-agreement', targetId: 'eligibility-api', targetType: 'service', relationshipType: 'data-consumer', metadata: { purpose: 'DCS consumes income data for eligibility', crossDepartment: true } },

  // BIA-DCS Identity Verification Agreement
  { id: 'rel-610', sourceId: 'dsa-bia-dcs-identity-2024', sourceType: 'data-sharing-agreement', targetId: 'identity-verification-api', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'BIA provides identity verification', crossDepartment: true } },
  { id: 'rel-611', sourceId: 'dsa-bia-dcs-identity-2024', sourceType: 'data-sharing-agreement', targetId: 'citizen-portal', targetType: 'service', relationshipType: 'data-consumer', metadata: { purpose: 'DCS citizen portal consumes identity data', crossDepartment: true } },

  // NHDS-DCS Health Data Agreement
  { id: 'rel-620', sourceId: 'dsa-nhds-dcs-health-2024', sourceType: 'data-sharing-agreement', targetId: 'summary-care-record-api', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'NHDS provides health summaries', crossDepartment: true } },
  { id: 'rel-621', sourceId: 'dsa-nhds-dcs-health-2024', sourceType: 'data-sharing-agreement', targetId: 'case-management', targetType: 'service', relationshipType: 'data-consumer', metadata: { purpose: 'DCS case management uses health data', crossDepartment: true } },

  // BIA-VLA Identity Agreement
  { id: 'rel-630', sourceId: 'dsa-bia-vla-identity-2023', sourceType: 'data-sharing-agreement', targetId: 'identity-verification-api', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'BIA provides identity checks', crossDepartment: true } },
  { id: 'rel-631', sourceId: 'dsa-bia-vla-identity-2023', sourceType: 'data-sharing-agreement', targetId: 'document-check-service', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'BIA provides document verification', crossDepartment: true } },

  // RTS-DCS Employment Status Agreement
  { id: 'rel-640', sourceId: 'dsa-rts-dcs-employment-2024', sourceType: 'data-sharing-agreement', targetId: 'rti-processor', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'RTS provides real-time employment info', crossDepartment: true } },
  { id: 'rel-641', sourceId: 'dsa-rts-dcs-employment-2024', sourceType: 'data-sharing-agreement', targetId: 'employer-api', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'RTS provides employer data', crossDepartment: true } },
  { id: 'rel-642', sourceId: 'dsa-rts-dcs-employment-2024', sourceType: 'data-sharing-agreement', targetId: 'eligibility-api', targetType: 'service', relationshipType: 'data-consumer', metadata: { purpose: 'DCS uses employment data for eligibility', crossDepartment: true } },

  // DSO Standards Agreement
  { id: 'rel-650', sourceId: 'dsa-dso-all-standards-2023', sourceType: 'data-sharing-agreement', targetId: 'api-gateway', targetType: 'service', relationshipType: 'data-provider', metadata: { purpose: 'DSO provides API standards' } },

  // =========================================================================
  // DATA SHARING AGREEMENT -> POLICY (complies-with)
  // These show which policies govern data sharing agreements
  // =========================================================================

  { id: 'rel-700', sourceId: 'dsa-dcs-rts-income-2024', sourceType: 'data-sharing-agreement', targetId: 'data-sharing-framework', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-701', sourceId: 'dsa-dcs-rts-income-2024', sourceType: 'data-sharing-agreement', targetId: 'welfare-data-reform', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-710', sourceId: 'dsa-bia-dcs-identity-2024', sourceType: 'data-sharing-agreement', targetId: 'digital-identity-programme', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-711', sourceId: 'dsa-bia-dcs-identity-2024', sourceType: 'data-sharing-agreement', targetId: 'secure-by-design', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-720', sourceId: 'dsa-nhds-dcs-health-2024', sourceType: 'data-sharing-agreement', targetId: 'data-sharing-framework', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-730', sourceId: 'dsa-bia-vla-identity-2023', sourceType: 'data-sharing-agreement', targetId: 'digital-identity-programme', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-740', sourceId: 'dsa-rts-dcs-employment-2024', sourceType: 'data-sharing-agreement', targetId: 'welfare-data-reform', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-741', sourceId: 'dsa-rts-dcs-employment-2024', sourceType: 'data-sharing-agreement', targetId: 'data-sharing-framework', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-750', sourceId: 'dsa-dso-all-standards-2023', sourceType: 'data-sharing-agreement', targetId: 'secure-by-design', targetType: 'policy', relationshipType: 'complies-with' },
  { id: 'rel-751', sourceId: 'dsa-dso-all-standards-2023', sourceType: 'data-sharing-agreement', targetId: 'digital-identity-programme', targetType: 'policy', relationshipType: 'complies-with' },
];

export default relationships;
