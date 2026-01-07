/**
 * Agent Query System for Wayfinder
 *
 * This module provides natural language query capabilities for the Wayfinder
 * knowledge base. It enables Slack-style queries like:
 *
 * - "who runs the API for revenue and tax"
 * - "what services does the identity team maintain"
 * - "show me patterns for API authentication"
 * - "who can I contact about citizen support APIs"
 *
 * The query system parses intent from natural language and returns structured
 * responses suitable for both UI display and Slack bot responses.
 */

import {
  services,
  teams,
  people,
  patterns,
  departments,
  getServiceById,
  getTeamById,
  getMaintainersForService,
  getServicesByTeam,
  getServicesByDepartment,
  getPeopleByDepartment,
  searchAll,
} from './data';

// ============================================================================
// TYPES
// ============================================================================

export type QueryIntent =
  | 'find_person'      // "who runs...", "who maintains...", "who can I contact..."
  | 'find_service'     // "what API...", "show me the service for..."
  | 'find_team'        // "what team...", "which team owns..."
  | 'find_pattern'     // "show me patterns for...", "how do I implement..."
  | 'list_services'    // "what services does X have", "list services in..."
  | 'list_consumers'   // "who uses this API", "what services consume..."
  | 'list_dependencies' // "what does X depend on"
  | 'general_search';  // fallback to keyword search

export interface QueryResult {
  intent: QueryIntent;
  confidence: number; // 0-1, how confident we are in the interpretation
  response: string;   // Human-readable response for Slack
  entities: QueryEntity[];
  suggestions?: string[]; // Follow-up queries the user might want
}

export interface QueryEntity {
  type: 'service' | 'team' | 'person' | 'pattern' | 'department';
  id: string;
  name: string;
  url: string;
  metadata?: Record<string, string>;
}

// ============================================================================
// INTENT DETECTION
// ============================================================================

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

// ============================================================================
// ENTITY EXTRACTION
// ============================================================================

/**
 * Extract department mentions from query
 * Matches: "revenue and tax", "RTS", "citizen support", "DCS", etc.
 */
function extractDepartment(query: string): typeof departments[number] | undefined {
  const q = query.toLowerCase();

  // Check acronyms first (exact match)
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

/**
 * Extract service type mentions from query
 */
function extractServiceType(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.includes('api')) return 'api';
  if (q.includes('platform')) return 'platform';
  if (q.includes('library') || q.includes('sdk')) return 'library';
  if (q.includes('event') || q.includes('stream')) return 'event-stream';
  return undefined;
}

/**
 * Extract topic/domain keywords for service matching
 */
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

// ============================================================================
// QUERY HANDLERS
// ============================================================================

function handleFindPerson(query: string): QueryResult {
  const dept = extractDepartment(query);
  const serviceType = extractServiceType(query);
  const keywords = extractTopicKeywords(query);

  // Find relevant services first
  let candidateServices = services;

  if (dept) {
    candidateServices = candidateServices.filter(s => s.departmentId === dept.id);
  }

  if (serviceType) {
    candidateServices = candidateServices.filter(s => s.type === serviceType);
  }

  // Score services by keyword match
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

  // Get maintainers for top service
  const topService = candidateServices[0];
  const maintainers = getMaintainersForService(topService.id);

  if (maintainers.length === 0) {
    return {
      intent: 'find_person',
      confidence: 0.7,
      response: `Found *${topService.name}* but no maintainers are listed. You might try contacting the ${topService.departmentId.toUpperCase()} department directly.`,
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

  let candidateServices = services;

  if (dept) {
    candidateServices = candidateServices.filter(s => s.departmentId === dept.id);
  }

  if (serviceType) {
    candidateServices = candidateServices.filter(s => s.type === serviceType);
  }

  // Score by keyword match
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
      suggestions: [
        'List all APIs',
        'Show services in Health Data',
      ],
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

  let candidateTeams = teams;

  if (dept) {
    candidateTeams = candidateTeams.filter(t => t.departmentId === dept.id);
  }

  // Score by keyword match
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
  const teamServices = getServicesByTeam(top.id);

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

  let candidatePatterns = patterns;

  // Score by keyword match
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

function handleListServices(query: string): QueryResult {
  const dept = extractDepartment(query);
  const serviceType = extractServiceType(query);

  let results = services;
  let description = 'All services';

  if (dept) {
    results = getServicesByDepartment(dept.id);
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
  response += displayed.map(s => `• *${s.name}* - ${s.description.substring(0, 60)}...`).join('\n');

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
  const results = searchAll(query);

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
  response += displayed.map(r => `• [${r.type}] *${r.name}* - ${r.description.substring(0, 50)}...`).join('\n');

  return {
    intent: 'general_search',
    confidence: 0.6,
    response,
    entities: displayed.map(r => ({
      type: r.type,
      id: r.id,
      name: r.name,
      url: r.type === 'service' ? `/services/${r.id}` :
           r.type === 'pattern' ? `/patterns/${r.id}` :
           r.type === 'team' ? `/teams/${r.id}` :
           `/people/${r.id}`,
    })),
  };
}

// ============================================================================
// MAIN QUERY FUNCTION
// ============================================================================

/**
 * Process a natural language query and return structured results
 *
 * @example
 * processQuery("who runs the API for revenue and tax")
 * // Returns maintainer info for Revenue & Taxation APIs
 *
 * @example
 * processQuery("show me authentication patterns")
 * // Returns patterns related to authentication
 */
export function processQuery(query: string): QueryResult {
  const { intent, confidence } = detectIntent(query);

  switch (intent) {
    case 'find_person':
      return handleFindPerson(query);
    case 'find_service':
      return handleFindService(query);
    case 'find_team':
      return handleFindTeam(query);
    case 'find_pattern':
      return handleFindPattern(query);
    case 'list_services':
      return handleListServices(query);
    case 'list_consumers':
    case 'list_dependencies':
      // TODO: Implement these
      return handleGeneralSearch(query);
    case 'general_search':
    default:
      return handleGeneralSearch(query);
  }
}

/**
 * Format a QueryResult for Slack Block Kit
 */
export function formatForSlack(result: QueryResult): object {
  const blocks: object[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: result.response,
      },
    },
  ];

  // Add entity links
  if (result.entities.length > 0) {
    const linkText = result.entities
      .slice(0, 3)
      .map(e => `<https://wayfinder.demo.gov.example${e.url}|View ${e.type}: ${e.name}>`)
      .join(' | ');

    blocks.push({
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: linkText,
      }],
    });
  }

  // Add suggestions
  if (result.suggestions && result.suggestions.length > 0) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Try asking:*\n' + result.suggestions.map(s => `• ${s}`).join('\n'),
        },
      }
    );
  }

  return { blocks };
}
