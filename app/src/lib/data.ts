/**
 * Data Layer for Wayfinder App
 *
 * This module bridges the demo-data into the Next.js application.
 * It re-exports types and provides lookup functions for all entities.
 *
 * In production, this would be replaced with actual API calls.
 * For the demo, we use the static seed data.
 */

// Import everything from demo-data
import {
  demoDataset,
  departments,
  teams,
  services,
  patterns,
  relationships,
  people,
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
} from '@/data-source';

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
} from '@/data-source/schema';

// Re-export data collections
export {
  demoDataset,
  departments,
  teams,
  services,
  patterns,
  relationships,
  people,
  stats,
  solidConfig,
};

// ============================================================================
// SERVICE HELPERS
// ============================================================================

export const getServiceById = _getServiceById;
export const getServicesByDepartment = _getServicesByDepartment;
export const getServicesByTeam = _getServicesByTeam;
export const getConsumers = _getConsumers;
export const getDependencies = _getDependencies;

// ============================================================================
// PEOPLE HELPERS
// ============================================================================

export const getPersonById = _getPersonById;
export const getPersonByWebId = _getPersonByWebId;
export const getPeopleByTeam = _getPeopleByTeam;
export const getPeopleByDepartment = _getPeopleByDepartment;
export const getMaintainersForService = _getMaintainersForService;

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
  type?: 'service' | 'pattern' | 'team' | 'person';
  department?: string;
  status?: string;
  category?: string;
}

export function searchAll(query: string, filters?: SearchFilters) {
  const q = query.toLowerCase();
  const results: Array<{
    type: 'service' | 'pattern' | 'team' | 'person';
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

  return results;
}

// ============================================================================
// GRAPH DATA HELPERS
// ============================================================================

export interface GraphNode {
  id: string;
  type: 'department' | 'team' | 'service' | 'pattern';
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
