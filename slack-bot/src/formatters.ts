/**
 * Slack Block Kit Formatters for Wayfinder
 *
 * Converts query results into rich Slack message formats using Block Kit.
 * These formatters create visually appealing, interactive messages that
 * feel native to Slack.
 */

import type { QueryResult } from './query.js';

const WAYFINDER_URL = process.env.WAYFINDER_URL || 'http://localhost:3001';

// Entity type emoji mappings
const ENTITY_EMOJIS: Record<string, string> = {
  service: ':electric_plug:',
  api: ':electric_plug:',
  pattern: ':clipboard:',
  team: ':busts_in_silhouette:',
  person: ':bust_in_silhouette:',
  department: ':office:',
};

// Department colours for visual distinction
const DEPARTMENT_COLOURS: Record<string, string> = {
  dso: '#00703c',
  dcs: '#1d70b8',
  rts: '#912b88',
  bia: '#d4351c',
  vla: '#f47738',
  nhds: '#005eb8',
};

// =============================================================================
// GENERIC FORMATTERS
// =============================================================================

export function formatSearchResults(result: QueryResult): { text: string; blocks: object[] } {
  const blocks: object[] = [];

  // Header
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':mag: Search Results',
      emoji: true,
    },
  });

  // Main response
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: result.response,
    },
  });

  // Entity cards
  if (result.entities.length > 0) {
    blocks.push({ type: 'divider' });

    result.entities.slice(0, 5).forEach(entity => {
      const emoji = ENTITY_EMOJIS[entity.type] || ':page_facing_up:';

      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${emoji} *<${WAYFINDER_URL}${entity.url}|${entity.name}>*\n_${entity.type}_${entity.metadata?.department ? ` • ${entity.metadata.department.toUpperCase()}` : ''}`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View Details',
            emoji: true,
          },
          url: `${WAYFINDER_URL}${entity.url}`,
          action_id: `view_details_${entity.type}_${entity.id}`,
        },
      });
    });
  }

  // Suggestions footer
  if (result.suggestions && result.suggestions.length > 0) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `:bulb: *Try asking:* ${result.suggestions.join(' • ')}`,
        }],
      }
    );
  }

  return {
    text: `Search results: ${result.entities.length} item(s) found`,
    blocks,
  };
}

// =============================================================================
// API/SERVICE DETAILS
// =============================================================================

export function formatApiDetails(result: QueryResult): { text: string; blocks: object[] } {
  const blocks: object[] = [];
  const entity = result.entities.find(e => e.type === 'service');

  // Header
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: `:electric_plug: ${entity?.name || 'API Details'}`,
      emoji: true,
    },
  });

  // Main description
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: result.response,
    },
  });

  // Metadata fields
  if (entity?.metadata) {
    const fields = [];
    if (entity.metadata.type) {
      fields.push({ type: 'mrkdwn', text: `*Type:*\n${entity.metadata.type}` });
    }
    if (entity.metadata.status) {
      fields.push({ type: 'mrkdwn', text: `*Status:*\n${entity.metadata.status}` });
    }
    if (entity.metadata.department) {
      fields.push({ type: 'mrkdwn', text: `*Department:*\n${entity.metadata.department.toUpperCase()}` });
    }

    if (fields.length > 0) {
      blocks.push({
        type: 'section',
        fields,
      });
    }
  }

  // Actions
  if (entity) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: ':page_facing_up: View in Wayfinder',
            emoji: true,
          },
          style: 'primary',
          url: `${WAYFINDER_URL}${entity.url}`,
          action_id: `view_service_${entity.id}`,
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: ':link: View in Graph',
            emoji: true,
          },
          url: `${WAYFINDER_URL}/graph?highlight=${entity.id}`,
          action_id: `view_graph_${entity.id}`,
        },
      ],
    });
  }

  return {
    text: entity ? `API: ${entity.name}` : 'API Details',
    blocks,
  };
}

// =============================================================================
// TEAM DETAILS
// =============================================================================

export function formatTeamDetails(result: QueryResult): { text: string; blocks: object[] } {
  const blocks: object[] = [];
  const entity = result.entities.find(e => e.type === 'team');

  // Header
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: `:busts_in_silhouette: ${entity?.name || 'Team Details'}`,
      emoji: true,
    },
  });

  // Main description
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: result.response,
    },
  });

  // Actions
  if (entity) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: ':page_facing_up: View Team',
            emoji: true,
          },
          style: 'primary',
          url: `${WAYFINDER_URL}${entity.url}`,
          action_id: `view_team_${entity.id}`,
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: ':electric_plug: Team Services',
            emoji: true,
          },
          url: `${WAYFINDER_URL}/services?team=${entity.id}`,
          action_id: `view_team_services_${entity.id}`,
        },
      ],
    });
  }

  return {
    text: entity ? `Team: ${entity.name}` : 'Team Details',
    blocks,
  };
}

// =============================================================================
// PERSON RESULTS
// =============================================================================

export function formatPersonResults(result: QueryResult): { text: string; blocks: object[] } {
  const blocks: object[] = [];
  const personEntities = result.entities.filter(e => e.type === 'person');
  const serviceEntity = result.entities.find(e => e.type === 'service');

  // Header - mention the service if present
  if (serviceEntity) {
    blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: `:bust_in_silhouette: Maintainers of ${serviceEntity.name}`,
        emoji: true,
      },
    });
  } else {
    blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: ':bust_in_silhouette: People',
        emoji: true,
      },
    });
  }

  // Main response
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: result.response,
    },
  });

  // Person cards
  if (personEntities.length > 0) {
    blocks.push({ type: 'divider' });

    personEntities.slice(0, 3).forEach(person => {
      const section: {
        type: 'section';
        text: { type: 'mrkdwn'; text: string };
        accessory?: { type: 'button'; text: { type: 'plain_text'; text: string; emoji: boolean }; url: string; action_id: string };
      } = {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:bust_in_silhouette: *${person.name}*\n${person.metadata?.role || '_Role not specified_'}\n:email: ${person.metadata?.email || '_Email not available_'}`,
        },
      };

      // Add view profile button
      section.accessory = {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Profile',
          emoji: true,
        },
        url: `${WAYFINDER_URL}${person.url}`,
        action_id: `view_person_${person.id}`,
      };

      blocks.push(section);
    });
  }

  // Solid Pod indicator
  if (personEntities.length > 0) {
    blocks.push({
      type: 'context',
      elements: [{
        type: 'mrkdwn',
        text: ':lock: _Profile data fetched from Solid Pods - decentralized identity_',
      }],
    });
  }

  // Service link if present
  if (serviceEntity) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: ':electric_plug: View Service',
            emoji: true,
          },
          url: `${WAYFINDER_URL}${serviceEntity.url}`,
          action_id: `view_service_${serviceEntity.id}`,
        },
      ],
    });
  }

  return {
    text: personEntities.length > 0 ? `Found ${personEntities.length} person(s)` : 'No people found',
    blocks,
  };
}

// =============================================================================
// HELP MESSAGE
// =============================================================================

export function formatHelpMessage(): { text: string; blocks: object[] } {
  return {
    text: 'Wayfinder Help',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: ':compass: Wayfinder - Knowledge Graph Bot',
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Find APIs, patterns, and expertise across government. Ask questions naturally or use slash commands.',
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:speech_balloon: Natural Language Examples*\n' +
                '• `@wayfinder who maintains the identity API?`\n' +
                '• `@wayfinder show me authentication patterns`\n' +
                '• `@wayfinder what services does Health Data have?`',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*:hammer_and_wrench: Slash Commands*\n' +
                '• `/wayfinder search <query>` - Search everything\n' +
                '• `/wayfinder api <name>` - Get API details\n' +
                '• `/wayfinder team <name>` - Get team info\n' +
                '• `/wayfinder who <question>` - Find people\n' +
                '• `/wayfinder pattern <topic>` - Find patterns\n' +
                '• `/wayfinder help` - Show this message',
        },
      },
      { type: 'divider' },
      {
        type: 'context',
        elements: [{
          type: 'mrkdwn',
          text: `:link: <${WAYFINDER_URL}|Open Wayfinder> • <${WAYFINDER_URL}/graph|Knowledge Graph>`,
        }],
      },
    ],
  };
}
