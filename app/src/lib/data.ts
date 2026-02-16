/**
 * Data Layer for Wayfinder App
 *
 * This module bridges the demo-data into the Next.js application.
 * It re-exports types and provides lookup functions for all entities.
 *
 * NOTE: This uses static data because it's imported by client components.
 * The admin panel reads directly from SQLite via lib/admin/*.ts
 */

// Import everything from demo-data
import {
  demoDataset,
  departments,
  teams,
  services,
  patterns,
  policies,
  relationships,
  people,
  agents,
  dataSharingAgreements,
  stats,
  solidConfig,
  // Service helpers
  getServiceById as _getServiceById,
  getServicesByDepartment as _getServicesByDepartment,
  getServicesByTeam as _getServicesByTeam,
  getConsumers as _getConsumers,
  getDependencies as _getDependencies,
  // People helpers
  getPersonById as _getPersonById,
  getPersonByWebId as _getPersonByWebId,
  getPeopleByTeam as _getPeopleByTeam,
  getPeopleByDepartment as _getPeopleByDepartment,
  getMaintainersForService as _getMaintainersForService,
  // Policy helpers
  getPolicyById as _getPolicyById,
  getPoliciesByDepartment as _getPoliciesByDepartment,
  getPoliciesAffectingService as _getPoliciesAffectingService,
  getRelatedPolicies as _getRelatedPolicies,
  getPoliciesByCategory as _getPoliciesByCategory,
  // Agent helpers
  getAgentById as _getAgentById,
  getAgentByWebId as _getAgentByWebId,
  getAgentsByDepartment as _getAgentsByDepartment,
  getAgentsByTeam as _getAgentsByTeam,
  getAgentsByType as _getAgentsByType,
  getAgentsConsumingService as _getAgentsConsumingService,
  getAgentsByStatus as _getAgentsByStatus,
  searchAgents as _searchAgents,
  // Data Sharing Agreement helpers
  getDataSharingAgreementById as _getDataSharingAgreementById,
  getAgreementsByDepartment as _getAgreementsByDepartment,
  getAgreementsByProvider as _getAgreementsByProvider,
  getAgreementsByConsumer as _getAgreementsByConsumer,
  getAgreementsForService as _getAgreementsForService,
  getAgreementsByCategory as _getAgreementsByCategory,
  getAgreementsByStatus as _getAgreementsByStatus,
  searchAgreements as _searchAgreements,
} from '@/data-source';

// Re-export data collections
export {
  demoDataset,
  departments,
  teams,
  services,
  patterns,
  policies,
  relationships,
  people,
  agents,
  dataSharingAgreements,
  stats,
  solidConfig,
};

// Re-export types
export type {
  Department,
  Team,
  Service,
  ServiceType,
  ServiceStatus,
  AuthType,
  Pattern,
  PatternCategory,
  CodeExample,
  Contributor,
  Relationship,
  EntityType,
  RelationshipType,
  Person,
  TeamWithSolid,
  SearchResult,
  Policy,
  PolicyCategory,
  PolicyStatus,
  // Agent types
  Agent,
  AgentType,
  AgentStatus,
  AgentCapability,
  AgentPermission,
  PermissionCondition,
  AgentAuditEntry,
  // Data Sharing Agreement types
  DataSharingAgreement,
  DataCategory,
  AgreementStatus,
} from '@/data-source/schema';

// ============================================================================
// SERVICE HELPERS
// ============================================================================

export function getServiceById(id: string) {
  return services.find((s) => s.id === id);
}

export function getServicesByDepartment(departmentId: string) {
  return services.filter((s) => s.departmentId === departmentId);
}

export function getServicesByTeam(teamId: string) {
  return services.filter((s) => s.teamId === teamId);
}

export function getConsumers(serviceId: string) {
  return services.filter((s) => s.dependsOn.includes(serviceId));
}

export function getDependencies(serviceId: string) {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return services.filter((s) => service.dependsOn.includes(s.id));
}

// ============================================================================
// PEOPLE HELPERS
// ============================================================================

export const getPersonById = _getPersonById;
export const getPersonByWebId = _getPersonByWebId;
export const getPeopleByTeam = _getPeopleByTeam;
export const getPeopleByDepartment = _getPeopleByDepartment;
export const getMaintainersForService = _getMaintainersForService;

// ============================================================================
// POLICY HELPERS
// ============================================================================

export const getPolicyById = _getPolicyById;
export const getPoliciesByDepartment = _getPoliciesByDepartment;
export const getPoliciesAffectingService = _getPoliciesAffectingService;
export const getRelatedPolicies = _getRelatedPolicies;
export const getPoliciesByCategory = _getPoliciesByCategory;

// ============================================================================
// AGENT HELPERS
// ============================================================================

export const getAgentById = _getAgentById;
export const getAgentByWebId = _getAgentByWebId;
export const getAgentsByDepartment = _getAgentsByDepartment;
export const getAgentsByTeam = _getAgentsByTeam;
export const getAgentsByType = _getAgentsByType;
export const getAgentsConsumingService = _getAgentsConsumingService;
export const getAgentsByStatus = _getAgentsByStatus;
export const searchAgents = _searchAgents;

// ============================================================================
// DATA SHARING AGREEMENT HELPERS
// ============================================================================

export const getDataSharingAgreementById = _getDataSharingAgreementById;
export const getAgreementsByDepartment = _getAgreementsByDepartment;
export const getAgreementsByProvider = _getAgreementsByProvider;
export const getAgreementsByConsumer = _getAgreementsByConsumer;
export const getAgreementsForService = _getAgreementsForService;
export const getAgreementsByCategory = _getAgreementsByCategory;
export const getAgreementsByStatus = _getAgreementsByStatus;
export const searchAgreements = _searchAgreements;

// ============================================================================
// DEPARTMENT HELPERS
// ============================================================================

export function getDepartmentById(id: string) {
  return departments.find((d) => d.id === id);
}

export function getDepartmentByAcronym(acronym: string) {
  return departments.find((d) => d.acronym.toLowerCase() === acronym.toLowerCase());
}

// ============================================================================
// TEAM HELPERS
// ============================================================================

export function getTeamById(id: string) {
  return teams.find((t) => t.id === id);
}

export function getTeamsByDepartment(departmentId: string) {
  return teams.filter((t) => t.departmentId === departmentId);
}

// ============================================================================
// PATTERN HELPERS
// ============================================================================

export function getPatternById(id: string) {
  return patterns.find((p) => p.id === id);
}

export function getPatternsByCategory(category: string) {
  return patterns.filter((p) => p.category === category);
}

export function getPatternsImplementedBy(serviceId: string) {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return patterns.filter((p) => service.relatedPatterns.includes(p.id));
}

export function getServicesImplementingPattern(patternId: string) {
  return services.filter((s) => s.relatedPatterns.includes(patternId));
}

// ============================================================================
// RELATIONSHIP HELPERS
// ============================================================================

export function getRelationshipsForService(serviceId: string) {
  return relationships.filter(
    (r) =>
      (r.sourceId === serviceId && r.sourceType === 'service') ||
      (r.targetId === serviceId && r.targetType === 'service')
  );
}

export function getRelationshipsForPattern(patternId: string) {
  return relationships.filter(
    (r) =>
      (r.sourceId === patternId && r.sourceType === 'pattern') ||
      (r.targetId === patternId && r.targetType === 'pattern')
  );
}

export function getCrossDepartmentRelationships() {
  return relationships.filter(
    (r) => r.metadata && (r.metadata as Record<string, unknown>).crossDepartment
  );
}

// ============================================================================
// SEARCH HELPERS
// ============================================================================

export interface SearchFilters {
  type?: 'service' | 'pattern' | 'team' | 'person' | 'agent' | 'data-sharing-agreement';
  department?: string;
  status?: string;
  category?: string;
}

export function searchAll(query: string, filters?: SearchFilters) {
  const q = query.toLowerCase();
  const results: Array<{
    type: 'service' | 'pattern' | 'team' | 'person' | 'agent' | 'data-sharing-agreement';
    id: string;
    name: string;
    description: string;
    department?: string;
  }> = [];

  // Search services
  if (!filters?.type || filters.type === 'service') {
    services
      .filter((s) => {
        if (filters?.department && s.departmentId !== filters.department) return false;
        if (filters?.status && s.status !== filters.status) return false;
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .forEach((s) => {
        results.push({
          type: 'service',
          id: s.id,
          name: s.name,
          description: s.description,
          department: s.departmentId,
        });
      });
  }

  // Search patterns
  if (!filters?.type || filters.type === 'pattern') {
    patterns
      .filter((p) => {
        if (filters?.category && p.category !== filters.category) return false;
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .forEach((p) => {
        results.push({
          type: 'pattern',
          id: p.id,
          name: p.name,
          description: p.description,
        });
      });
  }

  // Search teams
  if (!filters?.type || filters.type === 'team') {
    teams
      .filter((t) => {
        if (filters?.department && t.departmentId !== filters.department) return false;
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      })
      .forEach((t) => {
        results.push({
          type: 'team',
          id: t.id,
          name: t.name,
          description: t.description,
          department: t.departmentId,
        });
      });
  }

  // Search people
  if (!filters?.type || filters.type === 'person') {
    people
      .filter((p) => {
        if (filters?.department && p.departmentId !== filters.department) return false;
        return (
          p.name.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
        );
      })
      .forEach((p) => {
        results.push({
          type: 'person',
          id: p.id,
          name: p.name,
          description: p.role,
          department: p.departmentId,
        });
      });
  }

  // Search agents
  if (!filters?.type || filters.type === 'agent') {
    agents
      .filter((a) => {
        if (filters?.department && a.departmentId !== filters.department) return false;
        if (filters?.status && a.status !== filters.status) return false;
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .forEach((a) => {
        results.push({
          type: 'agent',
          id: a.id,
          name: a.name,
          description: a.description,
          department: a.departmentId,
        });
      });
  }

  // Search data sharing agreements
  if (!filters?.type || filters.type === 'data-sharing-agreement') {
    dataSharingAgreements
      .filter((dsa) => {
        if (filters?.department &&
            dsa.providingDepartmentId !== filters.department &&
            dsa.consumingDepartmentId !== filters.department) return false;
        if (filters?.status && dsa.status !== filters.status) return false;
        if (filters?.category && dsa.category !== filters.category) return false;
        return (
          dsa.name.toLowerCase().includes(q) ||
          dsa.description.toLowerCase().includes(q) ||
          dsa.dataElements.some((e) => e.toLowerCase().includes(q)) ||
          dsa.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .forEach((dsa) => {
        results.push({
          type: 'data-sharing-agreement',
          id: dsa.id,
          name: dsa.name,
          description: dsa.description,
          department: dsa.providingDepartmentId,
        });
      });
  }

  return results;
}

// ============================================================================
// GRAPH DATA HELPERS
// ============================================================================

export interface GraphNode {
  id: string;
  type: 'department' | 'team' | 'service' | 'pattern' | 'policy' | 'agent' | 'data-sharing-agreement';
  label: string;
  department?: string;
  group?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  crossDepartment?: boolean;
}

export function getGraphData() {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Add service nodes
  services.forEach((s) => {
    nodes.push({
      id: s.id,
      type: 'service',
      label: s.name,
      department: s.departmentId,
      group: s.departmentId,
    });
  });

  // Add pattern nodes
  patterns.forEach((p) => {
    nodes.push({
      id: p.id,
      type: 'pattern',
      label: p.name,
      group: 'patterns',
    });
  });

  // Add policy nodes
  policies.forEach((p) => {
    nodes.push({
      id: p.id,
      type: 'policy',
      label: p.name,
      department: p.leadDepartment,
      group: 'policies',
    });
  });

  // Add agent nodes
  agents.forEach((a) => {
    nodes.push({
      id: a.id,
      type: 'agent',
      label: a.name,
      department: a.departmentId,
      group: 'agents',
    });
  });

  // Add data sharing agreement nodes
  dataSharingAgreements.forEach((dsa) => {
    nodes.push({
      id: dsa.id,
      type: 'data-sharing-agreement',
      label: dsa.name,
      department: dsa.providingDepartmentId,
      group: 'agreements',
    });
  });

  // Create a set of valid node IDs for filtering edges
  const nodeIds = new Set(nodes.map(n => n.id));

  // Add edges from relationships (only if both source and target exist as nodes)
  // This filters out team->department and team->pattern relationships
  relationships.forEach((r) => {
    if (nodeIds.has(r.sourceId) && nodeIds.has(r.targetId)) {
      edges.push({
        source: r.sourceId,
        target: r.targetId,
        type: r.relationshipType,
        crossDepartment: !!(r.metadata as Record<string, unknown>)?.crossDepartment,
      });
    }
  });

  // Add edges from service dependencies
  services.forEach((s) => {
    s.dependsOn.forEach((depId) => {
      // Check if edge already exists and target node exists
      const exists = edges.some(
        (e) => e.source === s.id && e.target === depId && e.type === 'consumes'
      );
      if (!exists && nodeIds.has(depId)) {
        const dep = getServiceById(depId);
        edges.push({
          source: s.id,
          target: depId,
          type: 'consumes',
          crossDepartment: dep ? dep.departmentId !== s.departmentId : false,
        });
      }
    });

    // Add pattern implementation edges (only if pattern node exists)
    s.relatedPatterns.forEach((patternId) => {
      if (nodeIds.has(patternId)) {
        edges.push({
          source: s.id,
          target: patternId,
          type: 'implements',
        });
      }
    });
  });

  // Add policy edges (policy -> services it governs)
  policies.forEach((p) => {
    p.relatedServices.forEach((serviceId) => {
      if (nodeIds.has(serviceId)) {
        const service = getServiceById(serviceId);
        edges.push({
          source: p.id,
          target: serviceId,
          type: 'governs',
          crossDepartment: service ? service.departmentId !== p.leadDepartment : false,
        });
      }
    });

    // Add policy -> policy edges for related policies
    p.relatedPolicies.forEach((relatedPolicyId) => {
      if (nodeIds.has(relatedPolicyId)) {
        edges.push({
          source: p.id,
          target: relatedPolicyId,
          type: 'requires',
        });
      }
    });
  });

  // Add agent -> service consumption edges (distinct type for styling)
  agents.forEach((a) => {
    a.consumesServices.forEach((serviceId) => {
      if (nodeIds.has(serviceId)) {
        const service = getServiceById(serviceId);
        edges.push({
          source: a.id,
          target: serviceId,
          type: 'agent-consumes',
          crossDepartment: service ? service.departmentId !== a.departmentId : false,
        });
      }
    });
  });

  // Add data sharing agreement -> service edges
  dataSharingAgreements.forEach((dsa) => {
    dsa.relatedServices.forEach((serviceId) => {
      if (nodeIds.has(serviceId)) {
        edges.push({
          source: dsa.id,
          target: serviceId,
          type: 'dsa-implements',
          crossDepartment: true, // DSAs are inherently cross-department
        });
      }
    });

    // Add DSA -> policy edges
    dsa.relatedPolicies.forEach((policyId) => {
      if (nodeIds.has(policyId)) {
        edges.push({
          source: dsa.id,
          target: policyId,
          type: 'complies-with',
        });
      }
    });
  });

  return { nodes, edges };
}

// ============================================================================
// COMPATIBILITY LAYER
// ============================================================================

// This provides a simplified Relationship type that matches what components expect
export interface SimpleRelationship {
  source: string;
  target: string;
  type: string;
  crossDepartment?: boolean;
  description?: string;
}

export function getSimpleRelationshipsForService(serviceId: string): SimpleRelationship[] {
  const service = getServiceById(serviceId);
  if (!service) return [];

  const result: SimpleRelationship[] = [];

  // Add dependsOn relationships
  service.dependsOn.forEach((depId) => {
    const dep = getServiceById(depId);
    result.push({
      source: serviceId,
      target: depId,
      type: 'depends-on',
      crossDepartment: dep ? dep.departmentId !== service.departmentId : false,
    });
  });

  // Add consumedBy relationships
  service.consumedBy.forEach((consumerId) => {
    const consumer = getServiceById(consumerId);
    result.push({
      source: consumerId,
      target: serviceId,
      type: 'consumed-by',
      crossDepartment: consumer ? consumer.departmentId !== service.departmentId : false,
    });
  });

  // Add pattern implementations
  service.relatedPatterns.forEach((patternId) => {
    result.push({
      source: serviceId,
      target: patternId,
      type: 'implements',
    });
  });

  return result;
}
