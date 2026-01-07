# Wayfinder

> Cross-Government Knowledge Platform - Making government tech knowledge discoverable

Wayfinder helps government developers find APIs, patterns, and expertise across departments. Instead of searching through scattered documentation, developers can ask natural language questions and explore an interactive knowledge graph.

## The Problem

Government developers waste hours finding the right API, learning from others who've solved similar problems, or discovering what already exists. Documentation is scattered across multiple platforms, often invisible to each other.

## The Solution

- **Natural Language Search** - Ask questions like "Who maintains the identity API?" or "Show me authentication patterns"
- **Interactive Knowledge Graph** - Explore how services, APIs, and teams connect across government
- **Slack Integration** - Query from where you work: `@wayfinder who runs the benefits API?`
- **Decentralised Identity** - People and team data from Solid Pods, not a central database

## Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Running the Web App

```bash
# Install dependencies
cd app
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the app.

### Running the Slack Bot

```bash
# Install dependencies
cd slack-bot
npm install

# Copy environment template
cp .env.example .env

# Configure your Slack app tokens (see slack-bot/.env.example for setup instructions)
# Then start the bot
npm run dev
```

## Project Structure

```
wayfinder/
├── app/                    # Next.js web application
│   ├── src/
│   │   ├── app/           # Pages (Next.js App Router)
│   │   ├── components/    # React components
│   │   │   ├── graph/     # D3.js knowledge graph
│   │   │   ├── solid/     # Solid Pod integration
│   │   │   └── cards/     # Entity cards
│   │   └── lib/           # Utilities and data access
│   └── package.json
│
├── slack-bot/              # Slack bot (Bolt.js)
│   ├── src/
│   │   ├── index.ts       # Main bot entry
│   │   ├── query.ts       # Query processing
│   │   └── formatters.ts  # Slack Block Kit formatters
│   └── package.json
│
├── demo-data/              # Shared demo data
│   ├── services/          # 75 services across 6 departments
│   ├── teams/             # 22 teams
│   ├── people/            # 22 fictional people
│   ├── patterns/          # 17 architecture patterns
│   └── departments/       # 6 government departments
│
├── pods/                   # Solid Pod configuration
└── wayfinder.md           # Project vision document
```

## Features

### Web Application

| Feature | Description |
|---------|-------------|
| **Ask Wayfinder** | Chat-style natural language queries |
| **Knowledge Graph** | Interactive D3.js visualisation with fullscreen mode |
| **Service Catalogue** | Browse and filter APIs by department |
| **Pattern Library** | Architecture patterns with code examples |
| **Team & People Pages** | Detail pages showing relationships |
| **Solid Pod Integration** | Decentralised profile data (when Pods are running) |

### Slack Bot

| Command | Description |
|---------|-------------|
| `@wayfinder <question>` | Natural language query |
| `/wayfinder help` | Show available commands |
| `/wayfinder search <query>` | Search the knowledge graph |
| `/wayfinder api <name>` | Get API/service details |
| `/wayfinder team <name>` | Get team information |
| `/wayfinder who <question>` | Find people |
| `/wayfinder pattern <topic>` | Find patterns |

## Demo Data

The platform includes realistic demo data for 6 fictional government departments:

| Code | Department | Services |
|------|------------|----------|
| DSO | Digital Standards Office | Shared platforms (API Gateway, Notify, Pay) |
| DCS | Department for Citizen Support | Benefits and welfare services |
| RTS | Revenue & Taxation Service | Tax and income services |
| BIA | Border & Identity Agency | Identity and border systems |
| VLA | Vehicle & Licensing Authority | Vehicle and driver services |
| NHDS | National Health Data Service | Health records and prescriptions |

All names use nature themes (rivers, trees, animals) to be obviously fictional while sounding plausible.

## Technology Stack

### Web App
- **Framework**: Next.js 16 (App Router)
- **Styling**: GOV.UK Design System + SCSS
- **Graph**: D3.js force-directed layout
- **State**: TanStack Query for server state
- **Solid**: @inrupt/solid-client for Pod integration

### Slack Bot
- **Framework**: Slack Bolt.js
- **Connection**: Socket Mode (no public URL needed)
- **Runtime**: Node.js with tsx

## Architecture Highlights

### Solid Pod Integration

People profiles are designed to be fetched from Solid Pods rather than stored centrally. This demonstrates:
- Each department controls their own staff data
- People own their profile information
- Wayfinder aggregates without storing

When Pods are offline, the app gracefully falls back to demo data.

### Intent-Based Query System

Natural language queries are processed through an intent detection system:
- Extracts entity references (services, teams, people)
- Classifies intent (search, lookup, who-runs)
- Routes to appropriate data sources
- Formats responses for the channel (web or Slack)

## Setting Up the Slack Bot

1. Create a Slack App at https://api.slack.com/apps
2. Enable **Socket Mode** (Settings > Socket Mode)
3. Add **Bot Token Scopes** (OAuth & Permissions):
   - `app_mentions:read`
   - `chat:write`
   - `commands`
4. Create a **Slash Command**: `/wayfinder`
5. Subscribe to **Bot Events**: `app_mention`
6. Install the app to your workspace
7. Copy tokens to `slack-bot/.env`

See `slack-bot/.env.example` for detailed setup instructions.

## Development

### Building for Production

```bash
# Web app
cd app
npm run build

# Slack bot
cd slack-bot
npm run build
```

### Type Checking

```bash
cd app && npm run typecheck
cd slack-bot && npm run typecheck
```

## License

MIT

---

Built as a proof of concept for making government tech knowledge discoverable.
