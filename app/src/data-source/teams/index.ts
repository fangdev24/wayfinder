import type { Team } from '../schema';

/**
 * Fictional Teams
 *
 * Teams use nature-themed names (animals, trees) which feels very
 * "government digital" while being obviously invented.
 *
 * Each team has realistic responsibilities and service ownership.
 */

export const teams: Team[] = [
  // =========================================================================
  // DSO - Digital Standards Office
  // =========================================================================
  {
    id: 'granite-platform',
    name: 'Granite Platform Team',
    departmentId: 'dso',
    description:
      'Maintains core shared infrastructure including API gateway, service mesh, and hosting platform used across government.',
    responsibilities: [
      'API Gateway management',
      'Service mesh configuration',
      'Cloud hosting platform',
      'Infrastructure standards',
    ],
    contact: 'granite-platform@demo.gov.example',
    slack: '#granite-platform-support',
    services: ['api-gateway', 'service-mesh', 'cloud-platform', 'secrets-manager'],
  },
  {
    id: 'cedar-design',
    name: 'Cedar Design System',
    departmentId: 'dso',
    description:
      'Develops and maintains the cross-government design system, component library, and accessibility standards.',
    responsibilities: [
      'Design system components',
      'Accessibility guidance',
      'Frontend standards',
      'Prototype kit',
    ],
    contact: 'cedar-design@demo.gov.example',
    slack: '#cedar-design-support',
    services: ['design-system', 'component-library', 'prototype-kit', 'accessibility-checker'],
  },
  {
    id: 'birch-notify',
    name: 'Birch Notifications',
    departmentId: 'dso',
    description:
      'Runs the cross-government notification platform for emails, SMS, and letters.',
    responsibilities: [
      'Email delivery',
      'SMS messaging',
      'Letter printing',
      'Template management',
    ],
    contact: 'birch-notify@demo.gov.example',
    slack: '#birch-notify-support',
    services: ['gov-notify', 'template-service', 'delivery-receipts'],
  },
  {
    id: 'willow-pay',
    name: 'Willow Payments',
    departmentId: 'dso',
    description:
      'Provides the shared payment platform for taking payments and issuing refunds across government services.',
    responsibilities: [
      'Card payments',
      'Direct debit',
      'Refund processing',
      'Payment reconciliation',
    ],
    contact: 'willow-pay@demo.gov.example',
    slack: '#willow-pay-support',
    services: ['gov-pay', 'refund-service', 'reconciliation-api'],
  },

  // =========================================================================
  // DCS - Department for Citizen Support
  // =========================================================================
  {
    id: 'puffin-delivery',
    name: 'Puffin Delivery Squad',
    departmentId: 'dcs',
    description:
      'Builds and runs citizen-facing benefit application services and eligibility checking.',
    responsibilities: [
      'Benefit applications',
      'Eligibility rules engine',
      'Citizen portal',
      'Case management',
    ],
    contact: 'puffin-delivery@demo.gov.example',
    slack: '#puffin-delivery',
    services: ['citizen-portal', 'eligibility-api', 'case-management', 'application-service'],
  },
  {
    id: 'cormorant-data',
    name: 'Cormorant Data Team',
    departmentId: 'dcs',
    description:
      'Manages citizen data, benefit calculations, and reporting across DCS systems.',
    responsibilities: [
      'Citizen data platform',
      'Benefit calculations',
      'Reporting & analytics',
      'Data quality',
    ],
    contact: 'cormorant-data@demo.gov.example',
    slack: '#cormorant-data',
    services: ['citizen-data-platform', 'calculation-engine', 'reporting-api', 'data-quality-service'],
  },
  {
    id: 'gannet-platform',
    name: 'Gannet Platform Engineering',
    departmentId: 'dcs',
    description:
      'Provides infrastructure, CI/CD, and platform services for DCS development teams.',
    responsibilities: [
      'DCS cloud infrastructure',
      'CI/CD pipelines',
      'Monitoring & alerting',
      'Developer tooling',
    ],
    contact: 'gannet-platform@demo.gov.example',
    slack: '#gannet-platform',
    services: ['dcs-platform', 'monitoring-stack', 'ci-cd-service'],
  },
  {
    id: 'tern-integration',
    name: 'Tern Integration Hub',
    departmentId: 'dcs',
    description:
      'Manages integrations with other departments and external partners for data sharing.',
    responsibilities: [
      'Cross-department APIs',
      'Partner integrations',
      'Data exchange protocols',
      'Integration testing',
    ],
    contact: 'tern-integration@demo.gov.example',
    slack: '#tern-integration',
    services: ['integration-hub', 'partner-gateway', 'data-exchange-api'],
  },

  // =========================================================================
  // RTS - Revenue & Taxation Service
  // =========================================================================
  {
    id: 'falcon-core',
    name: 'Falcon Core Systems',
    departmentId: 'rts',
    description:
      'Maintains the core tax calculation and assessment systems.',
    responsibilities: [
      'Tax calculation engine',
      'Assessment processing',
      'Tax account management',
      'Payment allocation',
    ],
    contact: 'falcon-core@demo.gov.example',
    slack: '#falcon-core',
    services: ['tax-calculation-engine', 'assessment-service', 'tax-account-api', 'payment-allocation'],
  },
  {
    id: 'kestrel-api',
    name: 'Kestrel API Team',
    departmentId: 'rts',
    description:
      'Builds and maintains external APIs for employers, agents, and other departments.',
    responsibilities: [
      'Employer APIs',
      'Agent services',
      'Income verification',
      'API developer portal',
    ],
    contact: 'kestrel-api@demo.gov.example',
    slack: '#kestrel-api',
    services: ['income-verification-api', 'employer-api', 'agent-services-api', 'rts-developer-portal'],
  },
  {
    id: 'merlin-data',
    name: 'Merlin Data Platform',
    departmentId: 'rts',
    description:
      'Manages the RTS data lake, analytics, and real-time information processing.',
    responsibilities: [
      'Data lake management',
      'Real-time income data',
      'Analytics platform',
      'Data governance',
    ],
    contact: 'merlin-data@demo.gov.example',
    slack: '#merlin-data',
    services: ['rts-data-lake', 'rti-processor', 'analytics-platform', 'data-governance-tools'],
  },
  {
    id: 'osprey-compliance',
    name: 'Osprey Compliance',
    departmentId: 'rts',
    description:
      'Builds fraud detection, risk scoring, and compliance checking systems.',
    responsibilities: [
      'Fraud detection',
      'Risk scoring',
      'Compliance rules',
      'Investigation tools',
    ],
    contact: 'osprey-compliance@demo.gov.example',
    slack: '#osprey-compliance',
    services: ['fraud-detection-api', 'risk-scoring-service', 'compliance-rules-engine'],
  },

  // =========================================================================
  // BIA - Border & Identity Agency
  // =========================================================================
  {
    id: 'wolf-identity',
    name: 'Wolf Identity Platform',
    departmentId: 'bia',
    description:
      'Provides identity verification and authentication services across government.',
    responsibilities: [
      'Identity verification',
      'Document validation',
      'Biometric matching',
      'Identity proofing',
    ],
    contact: 'wolf-identity@demo.gov.example',
    slack: '#wolf-identity',
    services: ['identity-verification-api', 'document-check-service', 'id-proofing-service'],
  },
  {
    id: 'bear-border',
    name: 'Bear Border Systems',
    departmentId: 'bia',
    description:
      'Manages border control systems, advance passenger information, and traveller verification.',
    responsibilities: [
      'Border systems',
      'Advance passenger info',
      'Watchlist checking',
      'E-gates',
    ],
    contact: 'bear-border@demo.gov.example',
    slack: '#bear-border',
    services: ['border-control-api', 'advance-passenger-info', 'watchlist-service', 'egate-service'],
  },
  {
    id: 'lynx-documents',
    name: 'Lynx Document Services',
    departmentId: 'bia',
    description:
      'Handles passport applications, visa processing, and right-to-work checks.',
    responsibilities: [
      'Passport applications',
      'Visa processing',
      'Right to work',
      'Document issuance',
    ],
    contact: 'lynx-documents@demo.gov.example',
    slack: '#lynx-documents',
    services: ['passport-application-api', 'visa-status-api', 'right-to-work-api', 'document-issuance'],
  },
  {
    id: 'fox-biometrics',
    name: 'Fox Biometrics Unit',
    departmentId: 'bia',
    description:
      'Manages biometric data collection, storage, and matching services.',
    responsibilities: [
      'Fingerprint matching',
      'Facial recognition',
      'Biometric enrolment',
      'Biometric database',
    ],
    contact: 'fox-biometrics@demo.gov.example',
    slack: '#fox-biometrics',
    services: ['biometric-matching-api', 'facial-recognition-service', 'biometric-enrolment'],
  },

  // =========================================================================
  // VLA - Vehicle & Licensing Authority
  // =========================================================================
  {
    id: 'badger-registry',
    name: 'Badger Vehicle Registry',
    departmentId: 'vla',
    description:
      'Maintains the national vehicle register and handles vehicle transactions.',
    responsibilities: [
      'Vehicle registration',
      'Keeper records',
      'Vehicle history',
      'Trade APIs',
    ],
    contact: 'badger-registry@demo.gov.example',
    slack: '#badger-registry',
    services: ['vehicle-register-api', 'keeper-records-api', 'vehicle-history-service', 'trade-api'],
  },
  {
    id: 'otter-licensing',
    name: 'Otter Licensing Team',
    departmentId: 'vla',
    description:
      'Handles driving licence applications, renewals, and entitlement checking.',
    responsibilities: [
      'Licence applications',
      'Entitlement checks',
      'Medical fitness',
      'Penalty points',
    ],
    contact: 'otter-licensing@demo.gov.example',
    slack: '#otter-licensing',
    services: ['licence-application-api', 'entitlement-check-api', 'penalty-points-api', 'medical-fitness-api'],
  },
  {
    id: 'hare-enquiries',
    name: 'Hare Enquiries Service',
    departmentId: 'vla',
    description:
      'Provides vehicle and driver lookup services to authorised users.',
    responsibilities: [
      'Vehicle enquiries',
      'Driver lookups',
      'Insurance industry feeds',
      'Police access',
    ],
    contact: 'hare-enquiries@demo.gov.example',
    slack: '#hare-enquiries',
    services: ['vehicle-enquiry-api', 'driver-lookup-api', 'insurance-industry-feed', 'police-enquiry-api'],
  },

  // =========================================================================
  // NHDS - National Health Data Service
  // =========================================================================
  {
    id: 'oak-records',
    name: 'Oak Health Records',
    departmentId: 'nhds',
    description:
      'Manages the national summary care record and health information exchange.',
    responsibilities: [
      'Summary care record',
      'Health information exchange',
      'Patient demographics',
      'Record access control',
    ],
    contact: 'oak-records@demo.gov.example',
    slack: '#oak-records',
    services: ['summary-care-record-api', 'health-info-exchange', 'patient-demographics-api', 'record-access-api'],
  },
  {
    id: 'elm-prescriptions',
    name: 'Elm Prescriptions Platform',
    departmentId: 'nhds',
    description:
      'Runs the electronic prescription service and medication management.',
    responsibilities: [
      'Electronic prescriptions',
      'Dispensing notifications',
      'Medication records',
      'Pharmacy integrations',
    ],
    contact: 'elm-prescriptions@demo.gov.example',
    slack: '#elm-prescriptions',
    services: ['electronic-prescription-api', 'dispensing-service', 'medication-record-api'],
  },
  {
    id: 'ash-integration',
    name: 'Ash Integration Services',
    departmentId: 'nhds',
    description:
      'Provides integration capabilities for health systems including FHIR APIs.',
    responsibilities: [
      'FHIR API platform',
      'Legacy system adapters',
      'Message routing',
      'Integration patterns',
    ],
    contact: 'ash-integration@demo.gov.example',
    slack: '#ash-integration',
    services: ['fhir-api-platform', 'message-router', 'legacy-adapters', 'integration-toolkit'],
  },
  {
    id: 'maple-analytics',
    name: 'Maple Health Analytics',
    departmentId: 'nhds',
    description:
      'Provides anonymised health data analytics and population health insights.',
    responsibilities: [
      'Population health data',
      'Anonymisation services',
      'Research data access',
      'Health dashboards',
    ],
    contact: 'maple-analytics@demo.gov.example',
    slack: '#maple-analytics',
    services: ['population-health-api', 'anonymisation-service', 'research-data-api', 'health-dashboards'],
  },
];

export default teams;
