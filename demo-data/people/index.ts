import type { Person } from '../schema';

/**
 * Fictional People Profiles
 *
 * These represent government staff across our fictional departments.
 * Names use nature themes (rivers, mountains, trees, stones) to be
 * obviously fake while sounding plausible.
 *
 * Each person has a Solid WebID pointing to their Pod.
 * Demo uses localhost:3002, production would be department Pod servers.
 */

const POD_BASE = 'http://localhost:3002';

export const people: Person[] = [
  // =========================================================================
  // DSO - Digital Standards Office
  // =========================================================================
  {
    id: 'flint-rivers',
    webId: `${POD_BASE}/flint-rivers/profile#me`,
    name: 'Flint Rivers',
    departmentId: 'dso',
    teamId: 'granite-platform',
    role: 'Lead Platform Engineer',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Go', 'Service Mesh'],
    email: 'flint.rivers@standards.demo.gov.example',
    maintains: ['api-gateway', 'service-mesh', 'cloud-platform'],
  },
  {
    id: 'brook-alder',
    webId: `${POD_BASE}/brook-alder/profile#me`,
    name: 'Brook Alder',
    departmentId: 'dso',
    teamId: 'granite-platform',
    role: 'Senior SRE',
    skills: ['Prometheus', 'Grafana', 'Kubernetes', 'Python'],
    email: 'brook.alder@standards.demo.gov.example',
    maintains: ['secrets-manager'],
  },
  {
    id: 'sage-thornton',
    webId: `${POD_BASE}/sage-thornton/profile#me`,
    name: 'Sage Thornton',
    departmentId: 'dso',
    teamId: 'cedar-design',
    role: 'Principal Designer',
    skills: ['Figma', 'Accessibility', 'Design Systems', 'CSS', 'React'],
    email: 'sage.thornton@standards.demo.gov.example',
    maintains: ['design-system', 'component-library'],
  },
  {
    id: 'rowan-marsh',
    webId: `${POD_BASE}/rowan-marsh/profile#me`,
    name: 'Rowan Marsh',
    departmentId: 'dso',
    teamId: 'birch-notify',
    role: 'Tech Lead',
    skills: ['Node.js', 'AWS SES', 'Twilio', 'PostgreSQL'],
    email: 'rowan.marsh@standards.demo.gov.example',
    maintains: ['gov-notify', 'template-service', 'delivery-receipts'],
  },
  {
    id: 'ivy-banks',
    webId: `${POD_BASE}/ivy-banks/profile#me`,
    name: 'Ivy Banks',
    departmentId: 'dso',
    teamId: 'willow-pay',
    role: 'Senior Developer',
    skills: ['Java', 'Spring Boot', 'PCI-DSS', 'PostgreSQL', 'Stripe'],
    email: 'ivy.banks@standards.demo.gov.example',
    maintains: ['gov-pay', 'refund-service', 'reconciliation-api'],
  },

  // =========================================================================
  // DCS - Department for Citizen Support
  // =========================================================================
  {
    id: 'river-stone',
    webId: `${POD_BASE}/river-stone/profile#me`,
    name: 'River Stone',
    departmentId: 'dcs',
    teamId: 'puffin-delivery',
    role: 'Lead Developer',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GDS Patterns'],
    email: 'river.stone@citizen-support.demo.gov.example',
    maintains: ['citizen-portal', 'eligibility-api', 'application-service'],
  },
  {
    id: 'hazel-brook',
    webId: `${POD_BASE}/hazel-brook/profile#me`,
    name: 'Hazel Brook',
    departmentId: 'dcs',
    teamId: 'puffin-delivery',
    role: 'Senior Developer',
    skills: ['TypeScript', 'React', 'Accessibility', 'Jest'],
    email: 'hazel.brook@citizen-support.demo.gov.example',
    maintains: ['citizen-portal', 'case-management'],
  },
  {
    id: 'clay-fielding',
    webId: `${POD_BASE}/clay-fielding/profile#me`,
    name: 'Clay Fielding',
    departmentId: 'dcs',
    teamId: 'cormorant-data',
    role: 'Data Engineer',
    skills: ['Python', 'Spark', 'Airflow', 'PostgreSQL', 'dbt'],
    email: 'clay.fielding@citizen-support.demo.gov.example',
    maintains: ['citizen-data-platform', 'calculation-engine', 'reporting-api'],
  },
  {
    id: 'fern-whitley',
    webId: `${POD_BASE}/fern-whitley/profile#me`,
    name: 'Fern Whitley',
    departmentId: 'dcs',
    teamId: 'tern-integration',
    role: 'Integration Architect',
    skills: ['API Design', 'Event Streaming', 'Kafka', 'OAuth'],
    email: 'fern.whitley@citizen-support.demo.gov.example',
    maintains: ['integration-hub', 'data-exchange-api', 'partner-gateway'],
  },

  // =========================================================================
  // RTS - Revenue & Taxation Service
  // =========================================================================
  {
    id: 'ash-morgan',
    webId: `${POD_BASE}/ash-morgan/profile#me`,
    name: 'Ash Morgan',
    departmentId: 'rts',
    teamId: 'falcon-core',
    role: 'Principal Architect',
    skills: ['Java', 'Domain Modeling', 'Tax Systems', 'Event Sourcing'],
    email: 'ash.morgan@revenue.demo.gov.example',
    maintains: ['tax-calculation-engine', 'assessment-service'],
  },
  {
    id: 'reed-oakley',
    webId: `${POD_BASE}/reed-oakley/profile#me`,
    name: 'Reed Oakley',
    departmentId: 'rts',
    teamId: 'kestrel-api',
    role: 'API Lead',
    skills: ['REST', 'OpenAPI', 'OAuth', 'Developer Experience'],
    email: 'reed.oakley@revenue.demo.gov.example',
    maintains: ['income-verification-api', 'employer-api', 'rts-developer-portal'],
  },
  {
    id: 'storm-vale',
    webId: `${POD_BASE}/storm-vale/profile#me`,
    name: 'Storm Vale',
    departmentId: 'rts',
    teamId: 'merlin-data',
    role: 'Data Platform Lead',
    skills: ['Spark', 'Kafka', 'AWS', 'Data Governance', 'Python'],
    email: 'storm.vale@revenue.demo.gov.example',
    maintains: ['rts-data-lake', 'rti-processor', 'analytics-platform'],
  },
  {
    id: 'wren-hartley',
    webId: `${POD_BASE}/wren-hartley/profile#me`,
    name: 'Wren Hartley',
    departmentId: 'rts',
    teamId: 'osprey-compliance',
    role: 'ML Engineer',
    skills: ['Python', 'TensorFlow', 'Fraud Detection', 'MLOps'],
    email: 'wren.hartley@revenue.demo.gov.example',
    maintains: ['fraud-detection-api', 'risk-scoring-service'],
  },

  // =========================================================================
  // BIA - Border & Identity Agency
  // =========================================================================
  {
    id: 'slate-wylder',
    webId: `${POD_BASE}/slate-wylder/profile#me`,
    name: 'Slate Wylder',
    departmentId: 'bia',
    teamId: 'wolf-identity',
    role: 'Identity Architect',
    skills: ['Identity Standards', 'OAuth', 'OIDC', 'Biometrics'],
    email: 'slate.wylder@identity.demo.gov.example',
    maintains: ['identity-verification-api', 'document-check-service', 'id-proofing-service'],
  },
  {
    id: 'gale-frost',
    webId: `${POD_BASE}/gale-frost/profile#me`,
    name: 'Gale Frost',
    departmentId: 'bia',
    teamId: 'bear-border',
    role: 'Senior Systems Engineer',
    skills: ['High-availability', 'Real-time Systems', 'Security'],
    email: 'gale.frost@identity.demo.gov.example',
    maintains: ['border-control-api', 'watchlist-service', 'egate-service'],
  },
  {
    id: 'laurel-finch',
    webId: `${POD_BASE}/laurel-finch/profile#me`,
    name: 'Laurel Finch',
    departmentId: 'bia',
    teamId: 'lynx-documents',
    role: 'Tech Lead',
    skills: ['Document Processing', 'Workflow', 'Node.js', 'PostgreSQL'],
    email: 'laurel.finch@identity.demo.gov.example',
    maintains: ['passport-application-api', 'visa-status-api', 'right-to-work-api'],
  },
  {
    id: 'cliff-ashford',
    webId: `${POD_BASE}/cliff-ashford/profile#me`,
    name: 'Cliff Ashford',
    departmentId: 'bia',
    teamId: 'fox-biometrics',
    role: 'Biometrics Lead',
    skills: ['Biometric Matching', 'Computer Vision', 'Python', 'C++'],
    email: 'cliff.ashford@identity.demo.gov.example',
    maintains: ['biometric-matching-api', 'facial-recognition-service', 'biometric-enrolment'],
  },

  // =========================================================================
  // VLA - Vehicle & Licensing Authority
  // =========================================================================
  {
    id: 'moss-sterling',
    webId: `${POD_BASE}/moss-sterling/profile#me`,
    name: 'Moss Sterling',
    departmentId: 'vla',
    teamId: 'badger-registry',
    role: 'Lead Developer',
    skills: ['Java', 'Spring', 'Oracle', 'Event Sourcing'],
    email: 'moss.sterling@vehicles.demo.gov.example',
    maintains: ['vehicle-register-api', 'keeper-records-api', 'vehicle-history-service'],
  },
  {
    id: 'dale-heather',
    webId: `${POD_BASE}/dale-heather/profile#me`,
    name: 'Dale Heather',
    departmentId: 'vla',
    teamId: 'otter-licensing',
    role: 'Senior Developer',
    skills: ['TypeScript', 'React', 'Node.js', 'GDS Patterns'],
    email: 'dale.heather@vehicles.demo.gov.example',
    maintains: ['licence-application-api', 'entitlement-check-api'],
  },
  {
    id: 'pine-holloway',
    webId: `${POD_BASE}/pine-holloway/profile#me`,
    name: 'Pine Holloway',
    departmentId: 'vla',
    teamId: 'hare-enquiries',
    role: 'API Platform Lead',
    skills: ['High-volume APIs', 'Caching', 'Rate Limiting', 'Go'],
    email: 'pine.holloway@vehicles.demo.gov.example',
    maintains: ['vehicle-enquiry-api', 'driver-lookup-api', 'police-enquiry-api'],
  },

  // =========================================================================
  // NHDS - National Health Data Service
  // =========================================================================
  {
    id: 'heath-willows',
    webId: `${POD_BASE}/heath-willows/profile#me`,
    name: 'Heath Willows',
    departmentId: 'nhds',
    teamId: 'oak-records',
    role: 'Clinical Systems Lead',
    skills: ['FHIR', 'HL7', 'Health Informatics', 'Java'],
    email: 'heath.willows@health-data.demo.gov.example',
    maintains: ['summary-care-record-api', 'health-info-exchange', 'patient-demographics-api'],
  },
  {
    id: 'juniper-cole',
    webId: `${POD_BASE}/juniper-cole/profile#me`,
    name: 'Juniper Cole',
    departmentId: 'nhds',
    teamId: 'elm-prescriptions',
    role: 'Senior Developer',
    skills: ['FHIR', 'Digital Signatures', 'Node.js', 'PostgreSQL'],
    email: 'juniper.cole@health-data.demo.gov.example',
    maintains: ['electronic-prescription-api', 'dispensing-service', 'medication-record-api'],
  },
  {
    id: 'birch-tanner',
    webId: `${POD_BASE}/birch-tanner/profile#me`,
    name: 'Birch Tanner',
    departmentId: 'nhds',
    teamId: 'ash-integration',
    role: 'Integration Architect',
    skills: ['FHIR', 'ITK3', 'MESH', 'Integration Patterns'],
    email: 'birch.tanner@health-data.demo.gov.example',
    maintains: ['fhir-api-platform', 'message-router', 'integration-toolkit'],
  },
  {
    id: 'aspen-grey',
    webId: `${POD_BASE}/aspen-grey/profile#me`,
    name: 'Aspen Grey',
    departmentId: 'nhds',
    teamId: 'maple-analytics',
    role: 'Data Privacy Lead',
    skills: ['Anonymisation', 'Differential Privacy', 'Python', 'Statistics'],
    email: 'aspen.grey@health-data.demo.gov.example',
    maintains: ['anonymisation-service', 'population-health-api', 'research-data-api'],
  },
];

// Helper functions
export function getPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

export function getPersonByWebId(webId: string): Person | undefined {
  return people.find((p) => p.webId === webId);
}

export function getPeopleByTeam(teamId: string): Person[] {
  return people.filter((p) => p.teamId === teamId);
}

export function getPeopleByDepartment(departmentId: string): Person[] {
  return people.filter((p) => p.departmentId === departmentId);
}

export function getMaintainersForService(serviceId: string): Person[] {
  return people.filter((p) => p.maintains.includes(serviceId));
}

export default people;
