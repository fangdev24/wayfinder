/**
 * Types for api.gov.uk catalogue data
 *
 * These types represent the structure of the official UK Government
 * API Catalogue maintained by CDDO (Central Digital and Data Office).
 *
 * Source: https://github.com/co-cddo/api-catalogue
 */

/**
 * Raw API entry from the api.gov.uk CSV catalogue
 */
export interface GovUkApiEntry {
  dateAdded: string;
  dateUpdated: string;
  url: string;
  name: string;
  description: string;
  documentation: string;
  license: string;
  maintainer: string;
  areaServed: string;
  startDate: string;
  endDate: string;
  provider: string;
}

/**
 * Normalized provider/department info
 */
export interface GovUkProvider {
  id: string; // e.g., 'government-digital-service'
  name: string; // e.g., 'Government Digital Service'
  apiCount: number;
}

/**
 * Comparison statistics between api.gov.uk and Wayfinder
 */
export interface ComparisonStats {
  govuk: {
    totalApis: number;
    providers: number;
    withDocumentation: number;
    lastUpdated: string;
  };
  wayfinder: {
    totalServices: number;
    departments: number;
    teams: number;
    people: number;
    patterns: number;
    policies: number;
    relationships: number;
  };
}

/**
 * Capability comparison item
 */
export interface CapabilityItem {
  name: string;
  description: string;
  govukStatus: 'available' | 'partial' | 'unavailable';
  wayfinderStatus: 'available' | 'partial' | 'unavailable';
  govukDetail?: string;
  wayfinderDetail?: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Decision framework question
 */
export interface DecisionQuestion {
  id: string;
  question: string;
  context: string;
  yesOption: {
    title: string;
    requires: string[];
    enables: string[];
  };
  noOption: {
    title: string;
    continues: string[];
    accepts: string[];
  };
}

/**
 * Governance gap item
 */
export interface GovernanceGap {
  serviceId: string;
  serviceName: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  suggestedPolicies: string[];
}

/**
 * Export format for stakeholder summary
 */
export interface StakeholderSummary {
  generatedAt: string;
  preparedFor: string;
  currentState: {
    source: string;
    apiCount: number;
    capabilities: string[];
    limitations: string[];
  };
  proposedState: {
    source: string;
    additionalCapabilities: string[];
    requirements: string[];
  };
  decisions: {
    question: string;
    options: string[];
  }[];
}
