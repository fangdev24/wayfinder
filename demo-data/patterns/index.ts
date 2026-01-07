import type { Pattern } from '../schema';

/**
 * Architecture Patterns
 *
 * These represent the "institutional knowledge" that makes Wayfinder valuable.
 * Each pattern shows multi-department contribution and real usage.
 */

export const patterns: Pattern[] = [
  // =========================================================================
  // INTEGRATION PATTERNS
  // =========================================================================
  {
    id: 'api-gateway-pattern',
    name: 'Cross-Government API Gateway',
    category: 'integration',
    description:
      'Standard approach for exposing APIs to other government departments through the central gateway.',
    problem:
      'Departments need to share APIs securely but managing individual connections is complex and inconsistent.',
    solution:
      'Route all cross-department API traffic through the Government API Gateway, which handles authentication, rate limiting, and monitoring centrally.',
    consequences: [
      'Centralised security and audit logging',
      'Consistent rate limiting and quota management',
      'Single point of visibility for cross-government traffic',
      'Requires gateway team for onboarding new APIs',
    ],
    implementedBy: [
      'api-gateway',
      'eligibility-api',
      'income-verification-api',
      'identity-verification-api',
      'vehicle-enquiry-api',
    ],
    relatedPatterns: ['oauth2-client-credentials', 'rate-limiting'],
    diagram: `graph LR
    A[Consuming Service] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[Rate Limiter]
    B --> E[Provider API]
    E --> F[Backend Service]`,
    codeExample: {
      language: 'typescript',
      description: 'Registering an API with the gateway',
      code: `// Register your API with the gateway
const gatewayConfig = {
  apiId: 'eligibility-api',
  basePath: '/citizen-support/eligibility',
  version: 'v2',
  authentication: 'oauth2-client-credentials',
  rateLimit: {
    requestsPerMinute: 1000,
    burstLimit: 100
  },
  scopes: ['eligibility:read', 'eligibility:check']
};

await gateway.registerApi(gatewayConfig);`,
    },
    contributors: [
      { teamId: 'granite-platform', contribution: 'Core gateway implementation', date: '2024-06-15' },
      { teamId: 'tern-integration', contribution: 'DCS onboarding patterns', date: '2025-02-10' },
      { teamId: 'kestrel-api', contribution: 'Rate limiting recommendations', date: '2025-08-22' },
    ],
    lastUpdated: '2026-02-15',
    tags: ['api', 'gateway', 'integration', 'security'],
  },
  {
    id: 'event-driven-integration',
    name: 'Event-Driven Cross-Department Integration',
    category: 'integration',
    description:
      'Using asynchronous events for non-time-critical data sharing between departments.',
    problem:
      'Synchronous API calls create tight coupling and cascading failures when services are unavailable.',
    solution:
      'Publish domain events to a shared event bus. Consuming departments subscribe to relevant events and process them asynchronously.',
    consequences: [
      'Loose coupling between departments',
      'Better resilience to temporary outages',
      'Eventually consistent data (not suitable for real-time)',
      'Requires event schema governance',
    ],
    implementedBy: [
      'integration-hub',
      'rti-processor',
      'dispensing-service',
      'insurance-industry-feed',
    ],
    relatedPatterns: ['saga-pattern', 'exactly-once-processing'],
    diagram: `graph LR
    A[Producer] --> B[Event Bus]
    B --> C[Consumer 1]
    B --> D[Consumer 2]
    B --> E[Consumer 3]
    subgraph DCS
    C
    end
    subgraph RTS
    D
    end
    subgraph NHDS
    E
    end`,
    codeExample: {
      language: 'typescript',
      description: 'Publishing a domain event',
      code: `// Publishing an eligibility change event
await eventBus.publish({
  eventType: 'citizen.eligibility.changed',
  version: '2.0',
  timestamp: new Date().toISOString(),
  correlationId: crypto.randomUUID(),
  payload: {
    citizenId: 'CIT-123456',
    previousStatus: 'pending',
    newStatus: 'eligible',
    effectiveDate: '2026-04-01'
  },
  metadata: {
    source: 'eligibility-api',
    department: 'dcs'
  }
});`,
    },
    contributors: [
      { teamId: 'tern-integration', contribution: 'Initial pattern design', date: '2024-09-10' },
      { teamId: 'merlin-data', contribution: 'RTS event streaming implementation', date: '2025-03-15' },
      { teamId: 'ash-integration', contribution: 'Health sector adaptations', date: '2025-11-20' },
    ],
    lastUpdated: '2026-01-28',
    tags: ['events', 'async', 'integration', 'messaging'],
  },
  {
    id: 'data-sharing-agreements',
    name: 'Cross-Department Data Sharing',
    category: 'integration',
    description:
      'Framework for establishing and managing data sharing agreements between departments.',
    problem:
      'Sharing data across departments requires legal agreements, technical contracts, and ongoing governance.',
    solution:
      'Standardised data sharing agreement template with automated technical contract generation and access auditing.',
    consequences: [
      'Clear legal and technical framework',
      'Auditable data access',
      'Reduces time to establish new sharing arrangements',
      'Requires upfront investment in governance processes',
    ],
    implementedBy: ['data-exchange-api', 'income-verification-api', 'identity-verification-api'],
    relatedPatterns: ['consent-management', 'data-minimisation'],
    contributors: [
      { teamId: 'tern-integration', contribution: 'Agreement templates', date: '2024-11-05' },
      { teamId: 'kestrel-api', contribution: 'RTS data sharing implementation', date: '2025-04-18' },
      { teamId: 'wolf-identity', contribution: 'Identity data considerations', date: '2025-07-22' },
    ],
    lastUpdated: '2026-02-10',
    tags: ['data-sharing', 'governance', 'legal', 'agreements'],
  },

  // =========================================================================
  // SECURITY PATTERNS
  // =========================================================================
  {
    id: 'oauth2-client-credentials',
    name: 'OAuth 2.0 Client Credentials Flow',
    category: 'security',
    description:
      'Standard authentication pattern for service-to-service communication within government.',
    problem:
      'Services need to authenticate with each other securely without user involvement.',
    solution:
      'Use OAuth 2.0 client credentials flow with short-lived tokens and scope-based access control.',
    consequences: [
      'Standardised authentication across government',
      'Fine-grained scope-based access control',
      'Token refresh handling required',
      'Requires credential management',
    ],
    implementedBy: [
      'api-gateway',
      'eligibility-api',
      'income-verification-api',
      'gov-notify',
      'gov-pay',
    ],
    relatedPatterns: ['api-gateway-pattern', 'secrets-management'],
    codeExample: {
      language: 'typescript',
      description: 'Obtaining and using an access token',
      code: `// Get access token
const tokenResponse = await fetch('https://auth.demo.gov.example/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: 'eligibility:check income:read'
  })
});

const { access_token } = await tokenResponse.json();

// Use token to call API
const response = await fetch('https://gateway.demo.gov.example/eligibility/v2/check', {
  headers: { 'Authorization': \`Bearer \${access_token}\` }
});`,
    },
    contributors: [
      { teamId: 'granite-platform', contribution: 'Auth service implementation', date: '2024-04-20' },
      { teamId: 'wolf-identity', contribution: 'Security review and guidance', date: '2024-08-15' },
    ],
    lastUpdated: '2026-01-15',
    tags: ['oauth', 'authentication', 'security', 'tokens'],
  },
  {
    id: 'mtls-everywhere',
    name: 'Mutual TLS for Sensitive APIs',
    category: 'security',
    description:
      'Using client certificates for highly sensitive service-to-service communication.',
    problem:
      'Some APIs require stronger authentication than tokens alone, especially for sensitive data.',
    solution:
      'Require client certificates (mTLS) in addition to OAuth tokens for sensitive API access.',
    consequences: [
      'Strongest authentication for service identity',
      'Certificate lifecycle management complexity',
      'Network-level verification before application layer',
      'Requires PKI infrastructure',
    ],
    implementedBy: [
      'biometric-matching-api',
      'watchlist-service',
      'police-enquiry-api',
      'summary-care-record-api',
    ],
    relatedPatterns: ['secrets-management', 'oauth2-client-credentials'],
    contributors: [
      { teamId: 'granite-platform', contribution: 'mTLS gateway support', date: '2024-07-10' },
      { teamId: 'fox-biometrics', contribution: 'Biometrics security requirements', date: '2024-11-08' },
      { teamId: 'oak-records', contribution: 'Health data protection guidance', date: '2025-02-14' },
    ],
    lastUpdated: '2026-02-20',
    tags: ['mtls', 'certificates', 'security', 'encryption'],
  },
  {
    id: 'secrets-management',
    name: 'Centralised Secrets Management',
    category: 'security',
    description:
      'Pattern for managing API keys, certificates, and credentials across government services.',
    problem:
      'Services need secure access to credentials without hardcoding or manual distribution.',
    solution:
      'Use Government Secrets Manager (Vault-based) with dynamic credentials and automatic rotation.',
    consequences: [
      'No secrets in code or config files',
      'Automatic credential rotation',
      'Centralised audit trail',
      'Requires secrets manager availability',
    ],
    implementedBy: ['secrets-manager', 'api-gateway', 'gov-notify', 'gov-pay'],
    relatedPatterns: ['oauth2-client-credentials', 'credential-rotation'],
    codeExample: {
      language: 'typescript',
      description: 'Retrieving secrets from the secrets manager',
      code: `import { SecretsClient } from '@gov/secrets-client';

const secrets = new SecretsClient({
  endpoint: 'https://secrets.demo.gov.example'
});

// Get database credentials (automatically rotated)
const dbCreds = await secrets.getSecret('myservice/database');

// Get API client credentials
const apiCreds = await secrets.getSecret('myservice/external-api');

// Credentials are cached and refreshed automatically
const connection = await db.connect({
  host: dbCreds.host,
  user: dbCreds.username,
  password: dbCreds.password
});`,
    },
    contributors: [
      { teamId: 'granite-platform', contribution: 'Secrets manager platform', date: '2024-05-12' },
      { teamId: 'gannet-platform', contribution: 'DCS integration patterns', date: '2024-10-20' },
    ],
    lastUpdated: '2026-01-08',
    tags: ['secrets', 'credentials', 'security', 'vault'],
  },

  // =========================================================================
  // DATA PATTERNS
  // =========================================================================
  {
    id: 'consent-management',
    name: 'Citizen Consent Management',
    category: 'data',
    description:
      'Pattern for managing citizen consent for data sharing between services and departments.',
    problem:
      'Citizens must consent to data sharing, and services need to verify consent before accessing data.',
    solution:
      'Centralised consent service with fine-grained permissions. APIs check consent before returning data.',
    consequences: [
      'Clear audit trail of consent',
      'Citizens can view and revoke consent',
      'Additional API call for consent checking',
      'Requires consent UI integration',
    ],
    implementedBy: [
      'data-exchange-api',
      'income-verification-api',
      'record-access-api',
      'entitlement-check-api',
    ],
    relatedPatterns: ['data-sharing-agreements', 'audit-logging', 'data-minimisation'],
    contributors: [
      { teamId: 'tern-integration', contribution: 'Consent service design', date: '2024-08-25' },
      { teamId: 'wolf-identity', contribution: 'Identity linking for consent', date: '2025-01-15' },
      { teamId: 'oak-records', contribution: 'Health consent requirements', date: '2025-05-10' },
    ],
    lastUpdated: '2026-03-01',
    tags: ['consent', 'gdpr', 'privacy', 'data-sharing'],
  },
  {
    id: 'data-minimisation',
    name: 'Data Minimisation in APIs',
    category: 'data',
    description:
      'Returning only the minimum data required for the consuming service\'s purpose.',
    problem:
      'APIs often return more data than consumers need, creating unnecessary data exposure.',
    solution:
      'Design APIs with purpose-specific endpoints that return only required fields. Use scopes to control data access.',
    consequences: [
      'Reduced data exposure risk',
      'Clearer API contracts',
      'May require multiple endpoints for different purposes',
      'Requires understanding of consumer needs',
    ],
    implementedBy: ['income-verification-api', 'identity-verification-api', 'visa-status-api'],
    relatedPatterns: ['consent-management', 'data-sharing-agreements'],
    codeExample: {
      language: 'typescript',
      description: 'Purpose-specific API responses',
      code: `// Bad: Returns everything
GET /api/citizen/123
{
  "name": "...", "address": "...", "income": "...",
  "benefits": [...], "medical": {...} // Too much!
}

// Good: Purpose-specific endpoint
GET /api/citizen/123/eligibility-summary
{
  "incomeThresholdMet": true,
  "residencyConfirmed": true,
  "existingBenefits": ["housing-benefit"]
  // Only what's needed for eligibility
}`,
    },
    contributors: [
      { teamId: 'kestrel-api', contribution: 'Income API design', date: '2024-12-10' },
      { teamId: 'wolf-identity', contribution: 'Identity minimisation patterns', date: '2025-03-22' },
    ],
    lastUpdated: '2026-02-05',
    tags: ['data', 'privacy', 'gdpr', 'api-design'],
  },
  {
    id: 'audit-logging',
    name: 'Security Audit Logging',
    category: 'data',
    description:
      'Comprehensive logging of security-relevant events for compliance and investigation.',
    problem:
      'Security incidents and data access must be traceable for compliance and forensics.',
    solution:
      'Structured audit logs with correlation IDs, sent to centralised log aggregation with tamper protection.',
    consequences: [
      'Full traceability of data access',
      'Supports compliance requirements',
      'Storage and retention costs',
      'Must not log sensitive data values',
    ],
    implementedBy: [
      'api-gateway',
      'case-management',
      'tax-calculation-engine',
      'summary-care-record-api',
    ],
    relatedPatterns: ['consent-management', 'observability-patterns'],
    codeExample: {
      language: 'typescript',
      description: 'Structured audit log entry',
      code: `await auditLog.write({
  timestamp: new Date().toISOString(),
  correlationId: request.correlationId,
  action: 'DATA_ACCESS',
  resource: 'citizen-record',
  resourceId: 'CIT-123456',
  actor: {
    serviceId: 'eligibility-api',
    userId: null, // Service-to-service
    department: 'dcs'
  },
  outcome: 'SUCCESS',
  dataAccessed: ['income-band', 'household-size'],
  purpose: 'eligibility-check',
  legalBasis: 'DSA-2024-0456'
});`,
    },
    contributors: [
      { teamId: 'granite-platform', contribution: 'Audit log infrastructure', date: '2024-06-30' },
      { teamId: 'osprey-compliance', contribution: 'Compliance requirements', date: '2024-09-15' },
      { teamId: 'oak-records', contribution: 'Health audit requirements', date: '2025-02-28' },
    ],
    lastUpdated: '2026-02-18',
    tags: ['audit', 'logging', 'security', 'compliance'],
  },

  // =========================================================================
  // RESILIENCE PATTERNS
  // =========================================================================
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker Pattern',
    category: 'resilience',
    description:
      'Preventing cascading failures when downstream services are unavailable.',
    problem:
      'When a downstream service fails, repeated calls waste resources and can cascade failures.',
    solution:
      'Implement circuit breakers that open after failures, return fast failures, and periodically retry.',
    consequences: [
      'Fast failure instead of timeouts',
      'Prevents cascade failures',
      'Requires fallback behaviour design',
      'Monitoring of circuit state needed',
    ],
    implementedBy: ['integration-hub', 'eligibility-api', 'health-info-exchange'],
    relatedPatterns: ['rate-limiting', 'async-notifications'],
    codeExample: {
      language: 'typescript',
      description: 'Circuit breaker implementation',
      code: `import { CircuitBreaker } from '@gov/resilience';

const incomeApiBreaker = new CircuitBreaker({
  name: 'income-verification-api',
  failureThreshold: 5,
  resetTimeout: 30000,
  fallback: async () => ({
    available: false,
    message: 'Income verification temporarily unavailable'
  })
});

// Usage
const income = await incomeApiBreaker.execute(async () => {
  return await incomeApi.verify(citizenId);
});`,
    },
    contributors: [
      { teamId: 'tern-integration', contribution: 'Pattern documentation', date: '2024-10-05' },
      { teamId: 'puffin-delivery', contribution: 'Citizen portal implementation', date: '2025-01-20' },
      { teamId: 'ash-integration', contribution: 'Health sector adaptations', date: '2025-06-15' },
    ],
    lastUpdated: '2026-01-25',
    tags: ['resilience', 'fault-tolerance', 'circuit-breaker'],
  },
  {
    id: 'rate-limiting',
    name: 'API Rate Limiting Strategy',
    category: 'resilience',
    description:
      'Protecting APIs from overload while ensuring fair access for all consumers.',
    problem:
      'APIs can be overwhelmed by excessive requests, affecting all consumers.',
    solution:
      'Implement tiered rate limits at the gateway based on consumer classification and API sensitivity.',
    consequences: [
      'Fair resource allocation',
      'Protection against runaway clients',
      'Requires quota monitoring and alerting',
      'Consumers must handle 429 responses',
    ],
    implementedBy: ['api-gateway', 'vehicle-enquiry-api', 'fhir-api-platform'],
    relatedPatterns: ['api-gateway-pattern', 'circuit-breaker'],
    contributors: [
      { teamId: 'granite-platform', contribution: 'Gateway rate limiting', date: '2024-05-25' },
      { teamId: 'hare-enquiries', contribution: 'High-volume API patterns', date: '2024-11-10' },
    ],
    lastUpdated: '2026-02-08',
    tags: ['rate-limiting', 'throttling', 'api', 'resilience'],
  },

  // =========================================================================
  // MESSAGING PATTERNS
  // =========================================================================
  {
    id: 'async-notifications',
    name: 'Asynchronous Notification Pattern',
    category: 'messaging',
    description:
      'Sending citizen notifications without blocking the main request flow.',
    problem:
      'Notification delivery (email, SMS) is slow and can fail; blocking on it degrades user experience.',
    solution:
      'Queue notification requests for asynchronous processing. Use callbacks or polling for delivery status.',
    consequences: [
      'Faster response to users',
      'Resilient to notification service issues',
      'Eventual delivery (not instant)',
      'Requires status tracking mechanism',
    ],
    implementedBy: ['gov-notify', 'case-management', 'passport-application-api'],
    relatedPatterns: ['webhook-patterns', 'delivery-receipts'],
    codeExample: {
      language: 'typescript',
      description: 'Queueing an async notification',
      code: `// Queue notification - returns immediately
const notification = await govNotify.send({
  templateId: 'benefit-decision',
  recipient: {
    email: citizen.email
  },
  personalisation: {
    name: citizen.name,
    decision: 'approved',
    amount: '£450.00'
  },
  reference: \`case-\${caseId}\`,
  callbackUrl: 'https://myservice/webhooks/notify'
});

// notification.id can be used to check status later
console.log(\`Notification queued: \${notification.id}\`);`,
    },
    contributors: [
      { teamId: 'birch-notify', contribution: 'Notify service design', date: '2024-04-15' },
      { teamId: 'puffin-delivery', contribution: 'Case management integration', date: '2024-09-20' },
    ],
    lastUpdated: '2026-01-20',
    tags: ['notifications', 'async', 'messaging', 'email', 'sms'],
  },
  {
    id: 'webhook-patterns',
    name: 'Webhook Best Practices',
    category: 'messaging',
    description:
      'Reliable webhook delivery for event notifications to external systems.',
    problem:
      'Webhooks can fail due to network issues or consumer downtime, leading to lost events.',
    solution:
      'Implement retries with exponential backoff, signature verification, and idempotency.',
    consequences: [
      'Reliable event delivery',
      'Consumers must handle duplicates',
      'Requires webhook endpoint security',
      'Retry storms possible without backoff',
    ],
    implementedBy: ['delivery-receipts', 'gov-pay', 'dispensing-service'],
    relatedPatterns: ['async-notifications', 'idempotency-keys'],
    codeExample: {
      language: 'typescript',
      description: 'Verifying webhook signatures',
      code: `// Verify webhook authenticity
function verifyWebhook(request: Request): boolean {
  const signature = request.headers['x-gov-signature'];
  const timestamp = request.headers['x-gov-timestamp'];
  const body = request.body;

  // Check timestamp is recent (prevent replay)
  const age = Date.now() - parseInt(timestamp);
  if (age > 300000) return false; // 5 min max

  // Verify HMAC signature
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(\`\${timestamp}.\${body}\`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`,
    },
    contributors: [
      { teamId: 'birch-notify', contribution: 'Webhook security patterns', date: '2024-07-08' },
      { teamId: 'willow-pay', contribution: 'Payment webhook implementation', date: '2024-10-15' },
    ],
    lastUpdated: '2026-02-12',
    tags: ['webhooks', 'callbacks', 'events', 'security'],
  },

  // =========================================================================
  // IDENTITY PATTERNS
  // =========================================================================
  {
    id: 'identity-proofing',
    name: 'Identity Proofing Levels',
    category: 'identity',
    description:
      'Framework for establishing identity confidence based on evidence strength.',
    problem:
      'Different services require different levels of identity confidence, but there\'s no consistent framework.',
    solution:
      'Define identity proofing levels (low, medium, high) with specific evidence requirements for each.',
    consequences: [
      'Consistent identity standards across government',
      'Services can specify required confidence level',
      'Higher levels require more user effort',
      'Requires identity evidence verification capability',
    ],
    implementedBy: ['identity-verification-api', 'id-proofing-service', 'citizen-portal'],
    relatedPatterns: ['document-validation', 'biometric-verification'],
    contributors: [
      { teamId: 'wolf-identity', contribution: 'Proofing level framework', date: '2024-06-20' },
      { teamId: 'puffin-delivery', contribution: 'Citizen service integration', date: '2024-12-05' },
    ],
    lastUpdated: '2026-02-25',
    tags: ['identity', 'proofing', 'authentication', 'verification'],
  },
  {
    id: 'liveness-detection',
    name: 'Biometric Liveness Detection',
    category: 'identity',
    description:
      'Ensuring biometric samples are from a live person, not a photo or replay attack.',
    problem:
      'Biometric systems can be fooled by photos, videos, or masks without liveness checks.',
    solution:
      'Implement active or passive liveness detection as part of biometric capture and verification.',
    consequences: [
      'Protection against presentation attacks',
      'May require specific device capabilities',
      'Can increase friction for users',
      'False rejection rate considerations',
    ],
    implementedBy: ['facial-recognition-service', 'biometric-enrolment', 'egate-service'],
    relatedPatterns: ['identity-proofing', 'biometric-matching'],
    contributors: [
      { teamId: 'fox-biometrics', contribution: 'Liveness detection implementation', date: '2024-08-12' },
      { teamId: 'bear-border', contribution: 'E-gate integration', date: '2025-02-18' },
    ],
    lastUpdated: '2026-03-05',
    tags: ['biometrics', 'liveness', 'security', 'anti-spoofing'],
  },

  // =========================================================================
  // ADDITIONAL PATTERNS
  // =========================================================================
  {
    id: 'idempotency-keys',
    name: 'Idempotent API Operations',
    category: 'resilience',
    description:
      'Ensuring API operations can be safely retried without duplicate effects.',
    problem:
      'Network failures can cause clients to retry requests, potentially causing duplicate transactions.',
    solution:
      'Require idempotency keys for mutating operations. Store and check keys before processing.',
    consequences: [
      'Safe retries for clients',
      'Requires idempotency key storage',
      'Clients must generate unique keys',
      'Key expiry considerations',
    ],
    implementedBy: ['gov-pay', 'application-service', 'payment-allocation'],
    relatedPatterns: ['webhook-patterns', 'saga-pattern'],
    codeExample: {
      language: 'typescript',
      description: 'Using idempotency keys',
      code: `// Client generates unique key per logical operation
const idempotencyKey = \`payment-\${orderId}-\${Date.now()}\`;

const payment = await govPay.createPayment({
  amount: 5000,
  reference: orderId,
  description: 'Passport application fee'
}, {
  headers: {
    'Idempotency-Key': idempotencyKey
  }
});

// Safe to retry with same key if network fails
// Server returns same response without duplicate charge`,
    },
    contributors: [
      { teamId: 'willow-pay', contribution: 'Payment idempotency implementation', date: '2024-05-18' },
      { teamId: 'puffin-delivery', contribution: 'Application service patterns', date: '2024-11-25' },
    ],
    lastUpdated: '2026-01-30',
    tags: ['idempotency', 'resilience', 'api', 'payments'],
  },
  {
    id: 'rules-engine',
    name: 'Business Rules Engine Pattern',
    category: 'data',
    description:
      'Externalising complex business rules from application code for easier updates.',
    problem:
      'Eligibility and calculation rules change frequently; embedding them in code requires deployments.',
    solution:
      'Use a rules engine with version-controlled rule definitions that can be updated independently.',
    consequences: [
      'Faster rule changes without deployment',
      'Rule versioning for audit trail',
      'Performance considerations for complex rules',
      'Requires rule authoring tooling',
    ],
    implementedBy: [
      'eligibility-api',
      'calculation-engine',
      'tax-calculation-engine',
      'compliance-rules-engine',
    ],
    relatedPatterns: ['versioned-calculations', 'audit-logging'],
    contributors: [
      { teamId: 'cormorant-data', contribution: 'Benefits rules engine', date: '2024-07-22' },
      { teamId: 'falcon-core', contribution: 'Tax rules implementation', date: '2024-10-30' },
      { teamId: 'osprey-compliance', contribution: 'Compliance rules patterns', date: '2025-03-10' },
    ],
    lastUpdated: '2026-02-22',
    tags: ['rules', 'business-logic', 'configuration', 'flexibility'],
  },
  {
    id: 'fhir-resources',
    name: 'FHIR Resource Patterns',
    category: 'data',
    description:
      'Using HL7 FHIR standards for health data interoperability.',
    problem:
      'Health data is exchanged in many formats, making integration complex and error-prone.',
    solution:
      'Adopt FHIR R4 as the standard for health data APIs, using standard resources and profiles.',
    consequences: [
      'Industry-standard interoperability',
      'Rich ecosystem of tools and libraries',
      'Learning curve for FHIR concepts',
      'May need UK-specific profiles',
    ],
    implementedBy: ['fhir-api-platform', 'health-info-exchange', 'summary-care-record-api'],
    relatedPatterns: ['smart-on-fhir', 'adapter-pattern'],
    contributors: [
      { teamId: 'ash-integration', contribution: 'FHIR platform implementation', date: '2024-09-05' },
      { teamId: 'oak-records', contribution: 'UK Core profiles', date: '2025-01-28' },
    ],
    lastUpdated: '2026-03-08',
    tags: ['fhir', 'hl7', 'health', 'interoperability', 'standards'],
  },
  {
    id: 'accessible-forms',
    name: 'Accessible Form Design',
    category: 'integration',
    description:
      'Building forms that meet WCAG 2.1 AA and work for all users.',
    problem:
      'Forms are often inaccessible to users with disabilities, failing legal requirements.',
    solution:
      'Use design system components with built-in accessibility. Follow GOV.UK form patterns.',
    consequences: [
      'Meets legal accessibility requirements',
      'Works for all users including assistive tech',
      'Consistent user experience',
      'Requires testing with real users',
    ],
    implementedBy: ['design-system', 'component-library', 'citizen-portal'],
    relatedPatterns: ['progressive-enhancement', 'error-handling-ui'],
    contributors: [
      { teamId: 'cedar-design', contribution: 'Form component design', date: '2024-04-10' },
      { teamId: 'puffin-delivery', contribution: 'Citizen portal forms', date: '2024-08-20' },
    ],
    lastUpdated: '2026-03-10',
    tags: ['accessibility', 'forms', 'wcag', 'design'],
  },
];

export default patterns;
