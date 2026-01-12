/**
 * Query Bridge for Wayfinder Slack Bot
 *
 * This module bridges the Slack bot to the Wayfinder query engine.
 * It reuses the same query logic as the web UI for consistency.
 *
 * For the demo, we import the data and query functions directly.
 * In production, this would call the Wayfinder API.
 */

// Import demo data directly (in production, this would be API calls)
import {
  services,
  teams,
  people,
  patterns,
  departments,
} from '../../demo-data/index.js';

// Import policies from app data-source (not in demo-data)
import { policies } from '../../app/src/data-source/policies.js';

import type { Service, Team, Person, Pattern, Department } from '../../demo-data/schema.js';
import type { Policy } from '../../app/src/data-source/schema.js';

// =============================================================================
// TYPES
// =============================================================================

export type QueryIntent =
  | 'find_person'
  | 'find_service'
  | 'find_team'
  | 'find_pattern'
  | 'find_policy'
  | 'list_services'
  | 'list_consumers'
  | 'list_dependencies'
  | 'general_search';

export interface QueryResult {
  intent: QueryIntent;
  confidence: number;
  response: string;
  entities: QueryEntity[];
  suggestions?: string[];
}

export interface QueryEntity {
  type: 'service' | 'team' | 'person' | 'pattern' | 'department' | 'policy';
  id: string;
  name: string;
  url: string;
  metadata?: Record<string, string>;
}

// =============================================================================
// INTENT DETECTION
// =============================================================================

const INTENT_PATTERNS: Array<{ pattern: RegExp; intent: QueryIntent }> = [
  // Person queries
  { pattern: /\b(who|whom)\b.*(runs?|maintains?|owns?|manages?|responsible)/i, intent: 'find_person' },
  { pattern: /\b(who|whom)\b.*(contact|talk to|reach|email|slack)/i, intent: 'find_person' },
  { pattern: /\bmaintainer(s)?\b/i, intent: 'find_person' },
  { pattern: /\bowner(s)?\b/i, intent: 'find_person' },
  { pattern: /\bcontact\b.*\bfor\b/i, intent: 'find_person' },

  // Service queries
  { pattern: /\b(what|which|show|find)\b.*(api|service|platform|library)/i, intent: 'find_service' },
  { pattern: /\bapi\b.*(for|about|handles?)/i, intent: 'find_service' },

  // Team queries
  { pattern: /\b(what|which)\b.*team\b.*(owns?|maintains?|runs?|responsible)/i, intent: 'find_team' },
  { pattern: /\bteam\b.*(for|behind|owns?)/i, intent: 'find_team' },

  // Pattern queries
  { pattern: /\bpattern(s)?\b.*(for|about|implement)/i, intent: 'find_pattern' },
  { pattern: /\bhow\b.*(implement|do|build|create)/i, intent: 'find_pattern' },
  { pattern: /\bbest practice(s)?\b/i, intent: 'find_pattern' },

  // Policy queries
  { pattern: /\bpolic(y|ies)\b.*(for|about|affect|impact|govern|relate|apply)/i, intent: 'find_policy' },
  { pattern: /\b(which|what)\b.*polic(y|ies)/i, intent: 'find_policy' },
  { pattern: /\brules?\b.*(for|about|govern)/i, intent: 'find_policy' },
  { pattern: /\bregulation(s)?\b/i, intent: 'find_policy' },
  { pattern: /\bcompliance\b/i, intent: 'find_policy' },
  { pattern: /\blegislation\b/i, intent: 'find_policy' },

  // List queries
  { pattern: /\b(list|show|all)\b.*services?\b/i, intent: 'list_services' },
  { pattern: /\bwhat\b.*services?\b.*(does|do|has|have)\b/i, intent: 'list_services' },
  { pattern: /\b(who|what)\b.*(uses?|consumes?|depends? on)/i, intent: 'list_consumers' },
  { pattern: /\bdependenc(y|ies)\b/i, intent: 'list_dependencies' },
];

function detectIntent(query: string): { intent: QueryIntent; confidence: number } {
  const normalised = query.toLowerCase().trim();

  for (const { pattern, intent } of INTENT_PATTERNS) {
    if (pattern.test(normalised)) {
      return { intent, confidence: 0.8 };
    }
  }

  return { intent: 'general_search', confidence: 0.5 };
}

// =============================================================================
// ENTITY EXTRACTION
// =============================================================================

function extractDepartment(query: string): Department | undefined {
  const q = query.toLowerCase();

  // Check acronyms first
  const acronymMatch = departments.find(d =>
    q.includes(d.acronym.toLowerCase())
  );
  if (acronymMatch) return acronymMatch;

  // Check name keywords
  const nameKeywords: Record<string, string> = {
    'revenue': 'rts',
    'tax': 'rts',
    'taxation': 'rts',
    'citizen': 'dcs',
    'support': 'dcs',
    'identity': 'bia',
    'border': 'bia',
    'vehicle': 'vla',
    'licensing': 'vla',
    'health': 'nhds',
    'digital': 'dso',
    'standards': 'dso',
  };

  for (const [keyword, deptId] of Object.entries(nameKeywords)) {
    if (q.includes(keyword)) {
      return departments.find(d => d.id === deptId);
    }
  }

  return undefined;
}

function extractServiceType(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.includes('api')) return 'api';
  if (q.includes('platform')) return 'platform';
  if (q.includes('library') || q.includes('sdk')) return 'library';
  if (q.includes('event') || q.includes('stream')) return 'event-stream';
  return undefined;
}

function extractTopicKeywords(query: string): string[] {
  const stopWords = new Set([
    'who', 'what', 'which', 'show', 'find', 'list', 'all', 'the', 'a', 'an',
    'for', 'about', 'in', 'on', 'at', 'to', 'of', 'and', 'or', 'is', 'are',
    'runs', 'run', 'maintains', 'maintain', 'owns', 'own', 'manages', 'manage',
    'api', 'apis', 'service', 'services', 'platform', 'team', 'person', 'people',
    'can', 'i', 'me', 'my', 'contact', 'talk', 'reach', 'email', 'slack',
    'does', 'do', 'has', 'have', 'get', 'give'
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

// =============================================================================
// QUERY HANDLERS
// =============================================================================

function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

function getMaintainersForService(serviceId: string): Person[] {
  return people.filter(p => p.maintains.includes(serviceId));
}

function handleFindPerson(query: string): QueryResult {
  const dept = extractDepartment(query);
  const serviceType = extractServiceType(query);
  const keywords = extractTopicKeywords(query);

  let candidateServices = [...services];

  if (dept) {
    candidateServices = candidateServices.filter(s => s.departmentId === dept.id);
  }

  if (serviceType) {
    candidateServices = candidateServices.filter(s => s.type === serviceType);
  }

  if (keywords.length > 0) {
    const scored = candidateServices.map(s => {
      const text = `${s.name} ${s.description} ${s.tags.join(' ')}`.toLowerCase();
      const matches = keywords.filter(k => text.includes(k)).length;
      return { service: s, score: matches };
    });
    candidateServices = scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.service);
  }

  if (candidateServices.length === 0) {
    return {
      intent: 'find_person',
      confidence: 0.6,
      response: `I couldn't find a matching service. Try being more specific, like "who maintains the Identity Verification API".`,
      entities: [],
      suggestions: [
        'List all services in Revenue & Taxation',
        'Who maintains citizen support services',
      ],
    };
  }

  const topService = candidateServices[0];
  const maintainers = getMaintainersForService(topService.id);

  if (maintainers.length === 0) {
    const team = getTeamById(topService.teamId);
    return {
      intent: 'find_person',
      confidence: 0.7,
      response: `Found *${topService.name}* but no individual maintainers are listed. Contact the team: ${team?.name || topService.departmentId.toUpperCase()}`,
      entities: [{
        type: 'service',
        id: topService.id,
        name: topService.name,
        url: `/services/${topService.id}`,
      }],
    };
  }

  const personEntities: QueryEntity[] = maintainers.map(p => ({
    type: 'person' as const,
    id: p.id,
    name: p.name,
    url: `/people/${encodeURIComponent(p.webId)}`,
    metadata: {
      role: p.role,
      email: p.email,
    },
  }));

  const primary = maintainers[0];
  const others = maintainers.slice(1);

  let response = `*${topService.name}* is maintained by *${primary.name}* (${primary.role}).\n`;
  response += `Contact: ${primary.email}`;

  if (others.length > 0) {
    response += `\n\nOther maintainers: ${others.map(p => p.name).join(', ')}`;
  }

  return {
    intent: 'find_person',
    confidence: 0.85,
    response,
    entities: [
      {
        type: 'service',
        id: topService.id,
        name: topService.name,
        url: `/services/${topService.id}`,
      },
      ...personEntities,
    ],
    suggestions: [
      `What services does ${primary.name} maintain`,
      `Show me other services in ${topService.departmentId.toUpperCase()}`,
    ],
  };
}

function handleFindService(query: string): QueryResult {
  const dept = extractDepartment(query);
  const serviceType = extractServiceType(query);
  const keywords = extractTopicKeywords(query);

  let candidateServices = [...services];

  if (dept) {
    candidateServices = candidateServices.filter(s => s.departmentId === dept.id);
  }

  if (serviceType) {
    candidateServices = candidateServices.filter(s => s.type === serviceType);
  }

  if (keywords.length > 0) {
    const scored = candidateServices.map(s => {
      const text = `${s.name} ${s.description} ${s.tags.join(' ')}`.toLowerCase();
      const matches = keywords.filter(k => text.includes(k)).length;
      return { service: s, score: matches };
    });
    candidateServices = scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.service);
  }

  if (candidateServices.length === 0) {
    return {
      intent: 'find_service',
      confidence: 0.6,
      response: `No matching services found. Try browsing the service catalogue.`,
      entities: [],
      suggestions: ['List all APIs', 'Show services in Health Data'],
    };
  }

  const top = candidateServices[0];
  const team = getTeamById(top.teamId);

  let response = `*${top.name}*\n`;
  response += `${top.description}\n\n`;
  response += `Type: ${top.type} | Status: ${top.status} | Dept: ${top.departmentId.toUpperCase()}`;
  if (team) {
    response += `\nTeam: ${team.name}`;
  }

  return {
    intent: 'find_service',
    confidence: 0.85,
    response,
    entities: [{
      type: 'service',
      id: top.id,
      name: top.name,
      url: `/services/${top.id}`,
      metadata: {
        type: top.type,
        status: top.status,
        department: top.departmentId,
      },
    }],
    suggestions: [
      `Who maintains ${top.name}`,
      `What patterns does ${top.name} implement`,
    ],
  };
}

function handleFindTeam(query: string): QueryResult {
  const dept = extractDepartment(query);
  const keywords = extractTopicKeywords(query);

  let candidateTeams = [...teams];

  if (dept) {
    candidateTeams = candidateTeams.filter(t => t.departmentId === dept.id);
  }

  if (keywords.length > 0) {
    const scored = candidateTeams.map(t => {
      const text = `${t.name} ${t.description}`.toLowerCase();
      const matches = keywords.filter(k => text.includes(k)).length;
      return { team: t, score: matches };
    });
    candidateTeams = scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.team);
  }

  if (candidateTeams.length === 0) {
    return {
      intent: 'find_team',
      confidence: 0.6,
      response: `No matching teams found.`,
      entities: [],
    };
  }

  const top = candidateTeams[0];
  const teamServices = services.filter(s => s.teamId === top.id);

  let response = `*${top.name}*\n`;
  response += `${top.description}\n\n`;
  response += `Dept: ${top.departmentId.toUpperCase()} | Slack: ${top.slack}\n`;
  response += `Maintains ${teamServices.length} service(s)`;

  return {
    intent: 'find_team',
    confidence: 0.8,
    response,
    entities: [{
      type: 'team',
      id: top.id,
      name: top.name,
      url: `/teams/${top.id}`,
    }],
    suggestions: [
      `List services maintained by ${top.name}`,
      `Who is on the ${top.name}`,
    ],
  };
}

function handleFindPattern(query: string): QueryResult {
  const keywords = extractTopicKeywords(query);

  let candidatePatterns = [...patterns];

  if (keywords.length > 0) {
    const scored = candidatePatterns.map(p => {
      const text = `${p.name} ${p.description} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
      const matches = keywords.filter(k => text.includes(k)).length;
      return { pattern: p, score: matches };
    });
    candidatePatterns = scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.pattern);
  }

  if (candidatePatterns.length === 0) {
    return {
      intent: 'find_pattern',
      confidence: 0.6,
      response: `No matching patterns found. Try browsing the pattern library.`,
      entities: [],
    };
  }

  const top = candidatePatterns[0];

  let response = `*${top.name}*\n`;
  response += `${top.description}\n\n`;
  response += `Category: ${top.category}\n`;
  response += `Implementations: ${top.implementedBy.length}`;

  return {
    intent: 'find_pattern',
    confidence: 0.8,
    response,
    entities: [{
      type: 'pattern',
      id: top.id,
      name: top.name,
      url: `/patterns/${top.id}`,
    }],
    suggestions: [
      `Show services implementing ${top.name}`,
      `Show other ${top.category} patterns`,
    ],
  };
}

function handleFindPolicy(query: string): QueryResult {
  const dept = extractDepartment(query);
  const keywords = extractTopicKeywords(query);

  let candidatePolicies = [...policies];

  // Filter by department if mentioned
  if (dept) {
    candidatePolicies = candidatePolicies.filter(
      p => p.leadDepartment === dept.id || p.affectedDepartments.includes(dept.id)
    );
  }

  // Score by keyword matches
  if (keywords.length > 0) {
    const scored = candidatePolicies.map(p => {
      const text = `${p.name} ${p.description} ${p.tags.join(' ')} ${p.category}`.toLowerCase();
      const matches = keywords.filter(k => text.includes(k)).length;
      return { policy: p, score: matches };
    });
    candidatePolicies = scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.policy);
  }

  if (candidatePolicies.length === 0) {
    return {
      intent: 'find_policy',
      confidence: 0.6,
      response: `No matching policies found. Try browsing the policy catalogue or use different keywords.`,
      entities: [],
      suggestions: [
        'Show policies for data sharing',
        'What policies affect identity services',
        'Show security policies',
      ],
    };
  }

  // Show top result with details
  const top = candidatePolicies[0];
  const others = candidatePolicies.slice(1, 4);

  let response = `*${top.name}*\n`;
  response += `${top.description}\n\n`;
  response += `Category: ${top.category} | Status: ${top.status}\n`;
  response += `Lead: ${top.leadDepartment.toUpperCase()} | Affects: ${top.affectedDepartments.map(d => d.toUpperCase()).join(', ')}\n`;

  if (top.relatedServices.length > 0) {
    const serviceNames = top.relatedServices
      .map(sid => services.find(s => s.id === sid)?.name)
      .filter(Boolean)
      .slice(0, 3);
    response += `Related services: ${serviceNames.join(', ')}`;
    if (top.relatedServices.length > 3) {
      response += ` (+${top.relatedServices.length - 3} more)`;
    }
  }

  if (others.length > 0) {
    response += `\n\n_Other related policies:_ ${others.map(p => p.name).join(', ')}`;
  }

  return {
    intent: 'find_policy',
    confidence: 0.85,
    response,
    entities: [{
      type: 'policy',
      id: top.id,
      name: top.name,
      url: `/policies/${top.id}`,
      metadata: {
        category: top.category,
        status: top.status,
        lead: top.leadDepartment,
      },
    }],
    suggestions: [
      `What services does ${top.name} affect`,
      `Show related policies`,
    ],
  };
}

function handleListServices(query: string): QueryResult {
  const dept = extractDepartment(query);
  const serviceType = extractServiceType(query);

  let results = [...services];
  let description = 'All services';

  if (dept) {
    results = results.filter(s => s.departmentId === dept.id);
    description = `Services in ${dept.name}`;
  }

  if (serviceType) {
    results = results.filter(s => s.type === serviceType);
    description += ` (${serviceType}s)`;
  }

  if (results.length === 0) {
    return {
      intent: 'list_services',
      confidence: 0.7,
      response: `No services found matching those criteria.`,
      entities: [],
    };
  }

  const displayed = results.slice(0, 5);
  let response = `*${description}* (${results.length} total)\n\n`;
  response += displayed.map(s => `- *${s.name}* - ${s.description.substring(0, 60)}...`).join('\n');

  if (results.length > 5) {
    response += `\n\n_...and ${results.length - 5} more. See full catalogue._`;
  }

  return {
    intent: 'list_services',
    confidence: 0.85,
    response,
    entities: displayed.map(s => ({
      type: 'service' as const,
      id: s.id,
      name: s.name,
      url: `/services/${s.id}`,
    })),
  };
}

function handleGeneralSearch(query: string): QueryResult {
  const q = query.toLowerCase();
  const results: Array<{ type: string; id: string; name: string; description: string }> = [];

  // Search services
  services
    .filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q))
    )
    .forEach(s => results.push({ type: 'service', id: s.id, name: s.name, description: s.description }));

  // Search patterns
  patterns
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
    .forEach(p => results.push({ type: 'pattern', id: p.id, name: p.name, description: p.description }));

  // Search teams
  teams
    .filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
    .forEach(t => results.push({ type: 'team', id: t.id, name: t.name, description: t.description }));

  // Search people
  people
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    )
    .forEach(p => results.push({ type: 'person', id: p.id, name: p.name, description: p.role }));

  // Search policies
  policies
    .filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    )
    .forEach(p => results.push({ type: 'policy', id: p.id, name: p.name, description: p.description }));

  if (results.length === 0) {
    return {
      intent: 'general_search',
      confidence: 0.4,
      response: `No results found for "${query}". Try different keywords.`,
      entities: [],
      suggestions: [
        'List all services',
        'Show patterns for authentication',
        'Who maintains identity services',
      ],
    };
  }

  const displayed = results.slice(0, 5);
  let response = `Found ${results.length} result(s) for "${query}":\n\n`;
  response += displayed.map(r => `- [${r.type}] *${r.name}* - ${r.description.substring(0, 50)}...`).join('\n');

  return {
    intent: 'general_search',
    confidence: 0.6,
    response,
    entities: displayed.map(r => ({
      type: r.type as QueryEntity['type'],
      id: r.id,
      name: r.name,
      url: r.type === 'service' ? `/services/${r.id}` :
           r.type === 'pattern' ? `/patterns/${r.id}` :
           r.type === 'team' ? `/teams/${r.id}` :
           r.type === 'policy' ? `/policies/${r.id}` :
           `/people/${r.id}`,
    })),
  };
}

// =============================================================================
// MAIN QUERY FUNCTION
// =============================================================================

export async function processSlackQuery(query: string): Promise<QueryResult> {
  const { intent } = detectIntent(query);

  switch (intent) {
    case 'find_person':
      return handleFindPerson(query);
    case 'find_service':
      return handleFindService(query);
    case 'find_team':
      return handleFindTeam(query);
    case 'find_pattern':
      return handleFindPattern(query);
    case 'find_policy':
      return handleFindPolicy(query);
    case 'list_services':
      return handleListServices(query);
    case 'list_consumers':
    case 'list_dependencies':
    case 'general_search':
    default:
      return handleGeneralSearch(query);
  }
}

// =============================================================================
// SLACK FORMATTING
// =============================================================================

export function formatForSlack(result: QueryResult): { text: string; blocks: object[] } {
  const blocks: object[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: result.response,
      },
    },
  ];

  // Add entity links as buttons
  if (result.entities.length > 0) {
    const buttons = result.entities.slice(0, 3).map(e => ({
      type: 'button',
      text: {
        type: 'plain_text',
        text: `View ${e.type}: ${e.name}`.substring(0, 75),
        emoji: true,
      },
      url: `${process.env.WAYFINDER_URL || 'http://localhost:3001'}${e.url}`,
      action_id: `view_details_${e.type}_${e.id}`,
    }));

    blocks.push({
      type: 'actions',
      elements: buttons,
    });
  }

  // Add suggestions
  if (result.suggestions && result.suggestions.length > 0) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `*Try asking:* ${result.suggestions.join(' | ')}`,
        }],
      }
    );
  }

  return {
    text: result.response.replace(/\*/g, ''), // Plain text fallback
    blocks,
  };
}
