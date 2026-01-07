/**
 * Wayfinder Slack Bot
 *
 * A Slack bot that allows developers to query the Wayfinder knowledge graph
 * directly from Slack. Complements the web UI:
 *
 * - Slack Bot: Quick targeted queries ("Who maintains X?", "What APIs does Y team own?")
 * - Graph UI: Exploration when you don't know what you're looking for
 *
 * Uses Socket Mode for development (no public URL needed).
 */

// Load environment variables from .env file
import 'dotenv/config';

import { App, LogLevel } from '@slack/bolt';
import { processSlackQuery, formatForSlack } from './query.js';
import { formatApiDetails, formatTeamDetails, formatPersonResults, formatSearchResults, formatHelpMessage } from './formatters.js';

// Validate required environment variables
const requiredEnvVars = ['SLACK_BOT_TOKEN', 'SLACK_SIGNING_SECRET', 'SLACK_APP_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    console.error('\nTo set up the Slack bot:');
    console.error('1. Create a Slack app at https://api.slack.com/apps');
    console.error('2. Enable Socket Mode and get an App-Level Token');
    console.error('3. Add Bot Token Scopes: app_mentions:read, chat:write, commands');
    console.error('4. Install the app to your workspace');
    console.error('5. Copy tokens to .env file');
    process.exit(1);
  }
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
});

// =============================================================================
// APP MENTION HANDLER
// Triggered when someone mentions @wayfinder in a channel
// =============================================================================

app.event('app_mention', async ({ event, say }) => {
  try {
    // Extract the query by removing the bot mention
    const query = event.text.replace(/<@[A-Z0-9]+>/gi, '').trim();

    if (!query) {
      await say(formatHelpMessage());
      return;
    }

    // Process the natural language query
    const result = await processSlackQuery(query);
    const response = formatForSlack(result);

    await say(response);
  } catch (error) {
    console.error('Error handling app mention:', error);
    await say({
      text: 'Sorry, I encountered an error processing your request. Please try again.',
    });
  }
});

// =============================================================================
// SLASH COMMAND HANDLER
// /wayfinder <action> <query>
// =============================================================================

app.command('/wayfinder', async ({ command, ack, respond }) => {
  await ack();

  try {
    const parts = command.text.trim().split(/\s+/);
    const action = parts[0]?.toLowerCase() || 'help';
    const query = parts.slice(1).join(' ');

    switch (action) {
      case 'search':
      case 's':
        if (!query) {
          await respond({ text: 'Usage: `/wayfinder search <query>`\nExample: `/wayfinder search identity verification`' });
          return;
        }
        const searchResult = await processSlackQuery(query);
        await respond(formatSearchResults(searchResult));
        break;

      case 'api':
      case 'service':
        if (!query) {
          await respond({ text: 'Usage: `/wayfinder api <name>`\nExample: `/wayfinder api Identity Verification`' });
          return;
        }
        const apiResult = await processSlackQuery(`show me the ${query} API`);
        await respond(formatApiDetails(apiResult));
        break;

      case 'team':
        if (!query) {
          await respond({ text: 'Usage: `/wayfinder team <name>`\nExample: `/wayfinder team Granite Platform`' });
          return;
        }
        const teamResult = await processSlackQuery(`what team ${query}`);
        await respond(formatTeamDetails(teamResult));
        break;

      case 'who':
        if (!query) {
          await respond({ text: 'Usage: `/wayfinder who <question>`\nExample: `/wayfinder who maintains the benefits API`' });
          return;
        }
        const whoResult = await processSlackQuery(`who ${query}`);
        await respond(formatPersonResults(whoResult));
        break;

      case 'pattern':
      case 'patterns':
        if (!query) {
          await respond({ text: 'Usage: `/wayfinder pattern <topic>`\nExample: `/wayfinder pattern authentication`' });
          return;
        }
        const patternResult = await processSlackQuery(`show me patterns for ${query}`);
        await respond(formatForSlack(patternResult));
        break;

      case 'help':
      case '':
        await respond(formatHelpMessage());
        break;

      default:
        // Treat the entire text as a natural language query
        const nlResult = await processSlackQuery(command.text);
        await respond(formatForSlack(nlResult));
    }
  } catch (error) {
    console.error('Error handling slash command:', error);
    await respond({
      text: 'Sorry, I encountered an error processing your request. Please try again.',
    });
  }
});

// =============================================================================
// INTERACTIVE MESSAGE HANDLERS
// Handle button clicks and other interactions
// =============================================================================

app.action(/^view_details_.*/, async ({ action, ack, respond }) => {
  await ack();

  // Extract entity type and ID from action_id
  // Format: view_details_<type>_<id>
  const actionId = 'action_id' in action ? action.action_id : '';
  const [, , entityType, entityId] = actionId.split('_');

  if (!entityType || !entityId) {
    await respond({ text: 'Invalid action', replace_original: false });
    return;
  }

  try {
    let result;
    switch (entityType) {
      case 'service':
        result = await processSlackQuery(`show me the service ${entityId}`);
        break;
      case 'pattern':
        result = await processSlackQuery(`show me pattern ${entityId}`);
        break;
      case 'team':
        result = await processSlackQuery(`what team ${entityId}`);
        break;
      default:
        result = await processSlackQuery(entityId);
    }

    await respond({
      ...formatForSlack(result),
      replace_original: false,
    });
  } catch (error) {
    console.error('Error handling action:', error);
    await respond({ text: 'Error loading details', replace_original: false });
  }
});

// =============================================================================
// START THE APP
// =============================================================================

(async () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
  await app.start(port);
  console.log('');
  console.log('====================================');
  console.log('  Wayfinder Slack Bot is running');
  console.log('====================================');
  console.log('');
  console.log('Mention @wayfinder in any channel or use /wayfinder commands');
  console.log('');
  console.log('Examples:');
  console.log('  @wayfinder who maintains the identity API?');
  console.log('  /wayfinder search authentication');
  console.log('  /wayfinder who runs revenue and tax APIs');
  console.log('  /wayfinder pattern API security');
  console.log('');
})();
