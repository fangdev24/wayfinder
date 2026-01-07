import type { Department } from '../schema';

/**
 * Fictional Government Departments
 *
 * These parallel real UK departments but with obviously fake names.
 * The naming convention uses descriptive titles that make their
 * purpose clear while being unmistakably synthetic.
 */

export const departments: Department[] = [
  {
    id: 'dso',
    name: 'Digital Standards Office',
    acronym: 'DSO',
    description:
      'Sets standards for digital service delivery across government. Provides shared platforms, design systems, and technical guidance.',
    domain: 'standards.demo.gov.example',
    colour: '#00703C', // Green - like GDS
    teams: ['granite-platform', 'cedar-design', 'birch-notify', 'willow-pay'],
    established: '2024-04-01',
  },
  {
    id: 'dcs',
    name: 'Department for Citizen Support',
    acronym: 'DCS',
    description:
      'Administers welfare programmes, pension payments, and citizen support services. Manages eligibility determination and benefit delivery.',
    domain: 'citizen-support.demo.gov.example',
    colour: '#1D70B8', // Blue
    teams: ['puffin-delivery', 'cormorant-data', 'gannet-platform', 'tern-integration'],
    established: '2023-09-15',
  },
  {
    id: 'rts',
    name: 'Revenue & Taxation Service',
    acronym: 'RTS',
    description:
      'Collects taxes, administers tax credits, and provides income verification services to other departments.',
    domain: 'revenue.demo.gov.example',
    colour: '#912B88', // Purple
    teams: ['falcon-core', 'kestrel-api', 'merlin-data', 'osprey-compliance'],
    established: '2023-06-01',
  },
  {
    id: 'bia',
    name: 'Border & Identity Agency',
    acronym: 'BIA',
    description:
      'Manages immigration, border control, and identity verification. Provides document checking and right-to-work services.',
    domain: 'identity.demo.gov.example',
    colour: '#D4351C', // Red
    teams: ['wolf-identity', 'bear-border', 'lynx-documents', 'fox-biometrics'],
    established: '2024-01-10',
  },
  {
    id: 'vla',
    name: 'Vehicle & Licensing Authority',
    acronym: 'VLA',
    description:
      'Registers vehicles, issues driving licences, and maintains the national vehicle database. Provides lookup services to other agencies.',
    domain: 'vehicles.demo.gov.example',
    colour: '#F47738', // Orange
    teams: ['badger-registry', 'otter-licensing', 'hare-enquiries'],
    established: '2023-11-20',
  },
  {
    id: 'nhds',
    name: 'National Health Data Service',
    acronym: 'NHDS',
    description:
      'Manages health records, prescription data, and clinical information sharing across the health system.',
    domain: 'health-data.demo.gov.example',
    colour: '#005EB8', // NHS Blue
    teams: ['oak-records', 'elm-prescriptions', 'ash-integration', 'maple-analytics'],
    established: '2024-02-28',
  },
];

export default departments;
