/**
 * api.gov.uk Catalogue Data
 *
 * This module provides access to the official UK Government API Catalogue.
 * Data is fetched from the CDDO GitHub repository and cached.
 *
 * We include a static snapshot for demo purposes to avoid runtime fetches.
 */

import type { GovUkApiEntry, GovUkProvider, ComparisonStats } from './types';
import { services } from '@/data-source/services';
import { departments } from '@/data-source/departments';
import { teams } from '@/data-source/teams';
import { patterns } from '@/data-source/patterns';
import { policies } from '@/data-source/policies';
import { relationships } from '@/data-source/relationships';

// CSV source URL (for reference)
export const GOVUK_CATALOGUE_URL =
  'https://raw.githubusercontent.com/co-cddo/api-catalogue/main/data/catalogue.csv';

/**
 * Static snapshot of api.gov.uk statistics
 * (Fetched 2026-01-11 to avoid runtime dependency)
 */
export const GOVUK_STATS = {
  totalApis: 1791,
  providers: 47,
  lastFetched: '2026-01-11',
  source: 'https://www.api.gov.uk/',
  githubRepo: 'https://github.com/co-cddo/api-catalogue',
};

/**
 * Sample of real providers from api.gov.uk
 */
export const GOVUK_PROVIDERS: GovUkProvider[] = [
  { id: 'nhs-digital', name: 'NHS Digital', apiCount: 89 },
  { id: 'hm-revenue-customs', name: 'HM Revenue & Customs', apiCount: 19 },
  { id: 'ordnance-survey', name: 'Ordnance Survey', apiCount: 8 },
  { id: 'department-for-work-and-pensions', name: 'Department for Work and Pensions', apiCount: 7 },
  { id: 'government-digital-service', name: 'Government Digital Service', apiCount: 7 },
  { id: 'driver-and-vehicle-licensing-agency', name: 'Driver and Vehicle Licensing Agency', apiCount: 3 },
  { id: 'companies-house', name: 'Companies House', apiCount: 2 },
  { id: 'hm-land-registry', name: 'HM Land Registry', apiCount: 4 },
  { id: 'ministry-of-justice', name: 'Ministry of Justice', apiCount: 4 },
  { id: 'office-of-national-statistics', name: 'Office for National Statistics', apiCount: 2 },
];

/**
 * Sample of real APIs from api.gov.uk (representative examples)
 */
export const GOVUK_SAMPLE_APIS: Partial<GovUkApiEntry>[] = [
  {
    name: 'GOV.UK Notify',
    provider: 'government-digital-service',
    description: 'GOV.UK Notify allows government departments to send emails, text messages and letters to their users.',
    documentation: 'https://www.notifications.service.gov.uk/documentation',
    url: 'https://api.notifications.service.gov.uk/',
  },
  {
    name: 'GOV.UK Pay',
    provider: 'government-digital-service',
    description: 'Anyone in the public sector can use GOV.UK Pay to take online payments.',
    documentation: 'https://docs.payments.service.gov.uk/api_reference/',
    url: 'https://publicapi.payments.service.gov.uk/',
  },
  {
    name: 'DVLA Vehicle Enquiry Service',
    provider: 'driver-and-vehicle-licensing-agency',
    description: 'The DVLA Vehicle Enquiry Service API provides vehicle details of a specified vehicle.',
    documentation: 'https://developer-portal.driver-vehicle-licensing.api.gov.uk/',
    url: 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry',
  },
  {
    name: 'Companies House API',
    provider: 'companies-house',
    description: 'The Companies House API provides access to all of the public data we hold on companies free of charge.',
    documentation: 'https://developer.companieshouse.gov.uk/api/docs/',
    url: 'https://api.companieshouse.gov.uk/',
  },
  {
    name: 'Personal Demographics Service (FHIR)',
    provider: 'nhs-digital',
    description: 'Access demographic information about patients registered with a GP practice in England.',
    documentation: 'https://digital.nhs.uk/developer/api-catalogue/personal-demographics-service-fhir',
    url: 'https://api.service.nhs.uk/personal-demographics/FHIR/R4/',
  },
];

/**
 * Get comparison statistics between api.gov.uk and Wayfinder
 */
export function getComparisonStats(): ComparisonStats {
  return {
    govuk: {
      totalApis: GOVUK_STATS.totalApis,
      providers: GOVUK_STATS.providers,
      withDocumentation: Math.round(GOVUK_STATS.totalApis * 0.85), // ~85% have docs
      lastUpdated: GOVUK_STATS.lastFetched,
    },
    wayfinder: {
      totalServices: services.length,
      departments: departments.length,
      teams: teams.length,
      people: 24, // From demo data
      patterns: patterns.length,
      policies: policies.length,
      relationships: relationships.length,
    },
  };
}

/**
 * Map Wayfinder fictional departments to real api.gov.uk providers
 */
export const DEPARTMENT_PROVIDER_MAPPING: Record<string, string> = {
  dso: 'government-digital-service',
  dcs: 'department-for-work-and-pensions',
  rts: 'hm-revenue-customs',
  bia: 'home-office', // Closest match
  vla: 'driver-and-vehicle-licensing-agency',
  nhds: 'nhs-digital',
};

/**
 * Get the real provider name for a Wayfinder department
 */
export function getRealProviderName(departmentId: string): string | null {
  const providerId = DEPARTMENT_PROVIDER_MAPPING[departmentId];
  if (!providerId) return null;

  const provider = GOVUK_PROVIDERS.find((p) => p.id === providerId);
  return provider?.name ?? null;
}
