# Agent Architecture: Implementation Design

## Overview

This design translates ADR-003 into concrete file changes, following existing codebase patterns.

---

## Phase 1: Data Model & Schema

### 1.1 Extend `demo-data/schema.ts`

Add to EntityType:
```typescript
export type EntityType =
  | 'department'
  | 'team'
  | 'service'
  | 'pattern'
  | 'agent';  // NEW
```

Add to RelationshipType:
```typescript
export type RelationshipType =
  | 'maintains'
  | 'belongs-to'
  | 'consumes'
  | 'implements'
  | 'contributed-to'
  | 'related-to'
  | 'owned-by'      // NEW: agent -> team
  | 'governed-by'   // NEW: agent -> policy
  | 'delegates-to'  // NEW: agent -> agent
  | 'reports-to';   // NEW: agent -> team
```

Add Agent types (from ADR-003):
```typescript
export type AgentType =
  | 'discovery'
  | 'operations'
  | 'compliance'
  | 'data'
  | 'intelligence'
  | 'support';

export type AgentStatus =
  | 'active'
  | 'testing'
  | 'suspended'
  | 'retired';

export interface AgentCapability {
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  requiresApproval: boolean;
}

export interface AgentPermission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'execute')[];
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  type: 'time_window' | 'approval_required' | 'rate_limit' | 'environment';
  value: string;
}

export interface Agent {
  id: string;
  webId: string;
  name: string;
  type: AgentType;
  departmentId: string;
  teamId: string;
  description: string;
  version: string;
  sourceRepository?: string;
  capabilities: AgentCapability[];
  consumesServices: string[];
  permissions: AgentPermission[];
  status: AgentStatus;
  createdAt: string;
  lastActiveAt: string;
  approvedBy: string;
  reviewDate: string;
  tags: string[];
}

export interface AgentAuditEntry {
  id: string;
  agentId: string;
  agentWebId: string;
  action: string;
  resource: string;
  timestamp: string;
  triggeredBy: 'schedule' | 'event' | 'human_request';
  requestedBy?: string;
  outcome: 'success' | 'failure' | 'blocked';
  reason?: string;
  inputHash?: string;
  outputHash?: string;
}
```

Add to DemoDataset:
```typescript
export interface DemoDataset {
  // ... existing fields
  agents?: Agent[];
}
```

---

## Phase 2: Demo Data

### 2.1 Create `demo-data/agents/index.ts`

```typescript
import type { Agent } from '../schema';

export const agents: Agent[] = [
  // 4 agents from ADR-003 with full data
];

export default agents;
```

### 2.2 Update `demo-data/index.ts`

Export agents alongside services, teams, etc.

---

## Phase 3: Relationships

### 3.1 Update `demo-data/relationships/index.ts`

Add agent relationships:
```typescript
// Agent -> Team (owned-by)
{ id: 'rel-agent-001', sourceId: 'wayfinder-discovery', sourceType: 'agent',
  targetId: 'granite-platform', targetType: 'team', relationshipType: 'owned-by' },

// Agent -> Service (consumes)
{ id: 'rel-agent-010', sourceId: 'wayfinder-discovery', sourceType: 'agent',
  targetId: 'neptune-graph', targetType: 'service', relationshipType: 'consumes' },

// Agent -> Policy (governed-by)
// ...
```

---

## Phase 4: Query Engine

### 4.1 Update `app/src/lib/agent-query.ts`

Add to QueryIntent:
```typescript
export type QueryIntent =
  | 'find_person'
  | 'find_service'
  | 'find_team'
  | 'find_pattern'
  | 'find_agent'    // NEW
  | 'list_agents'   // NEW
  | 'list_services'
  | 'list_consumers'
  | 'list_dependencies'
  | 'general_search';
```

Add intent patterns:
```typescript
// Agent queries
{ pattern: /\b(what|which|show|find)\b.*(agent|bot)/i, intent: 'find_agent' },
{ pattern: /\bagent(s)?\b.*(for|runs?|does)/i, intent: 'find_agent' },
{ pattern: /\bbot(s)?\b.*(for|runs?|handles?)/i, intent: 'find_agent' },
{ pattern: /\bwho\b.*(deploy|automat)/i, intent: 'find_agent' },
{ pattern: /\b(list|show|all)\b.*agents?\b/i, intent: 'list_agents' },
{ pattern: /\bwhat\b.*agents?\b.*(does|do|has|have|run)\b/i, intent: 'list_agents' },
```

Add handlers:
- `handleFindAgent(query)` - Find agent by keywords/type/department
- `handleListAgents(query)` - List agents by department/type

### 4.2 Update `slack-bot/src/query.ts`

Mirror the same changes for Slack bot consistency.

---

## Phase 5: UI Pages

### 5.1 Create `app/src/app/agents/page.tsx`

Agent listing page:
- Filter by type (dropdown: all, discovery, operations, etc.)
- Filter by department
- Filter by status (active, testing, suspended)
- Cards showing agent name, type, department, status

### 5.2 Create `app/src/app/agents/[id]/page.tsx`

Agent detail page:
- Header with name, type badge, status badge
- Description
- Capabilities table with risk levels
- Services consumed (links)
- Permissions (collapsible)
- Owning team (link)
- Governance info (approved by, review date)

### 5.3 Create `app/src/components/cards/AgentCard.tsx`

Card component matching ServiceCard/TeamCard patterns.

---

## Phase 6: Integration

### 6.1 Update Service Detail Page

Add "Consumed by Agents" section to `/services/[id]`:
```tsx
// Find agents that consume this service
const consumingAgents = agents.filter(a =>
  a.consumesServices.includes(service.id)
);
```

### 6.2 Update Team Detail Page

Add "Agents Owned by Team" section to `/teams/[id]`:
```tsx
const teamAgents = agents.filter(a => a.teamId === team.id);
```

### 6.3 Update Knowledge Graph

Add agent nodes to graph visualisation:
- New node type with distinct colour
- Include in graph data source

---

## File Change Summary

| File | Action | Description |
|------|--------|-------------|
| `demo-data/schema.ts` | Modify | Add Agent types and interfaces |
| `demo-data/agents/index.ts` | Create | 4 demo agents |
| `demo-data/index.ts` | Modify | Export agents |
| `demo-data/relationships/index.ts` | Modify | Add agent relationships |
| `app/src/lib/agent-query.ts` | Modify | Add agent intents/handlers |
| `app/src/lib/data.ts` | Modify | Add agent data access functions |
| `slack-bot/src/query.ts` | Modify | Add agent query support |
| `app/src/app/agents/page.tsx` | Create | Agent listing page |
| `app/src/app/agents/[id]/page.tsx` | Create | Agent detail page |
| `app/src/components/cards/AgentCard.tsx` | Create | Agent card component |
| `app/src/app/services/[id]/page.tsx` | Modify | Add consuming agents |
| `app/src/app/teams/[id]/page.tsx` | Modify | Add team agents |

---

## Implementation Order

1. **Schema first** - All types must exist before data
2. **Demo data** - Agents and relationships
3. **Data layer** - Export and access functions
4. **Query engine** - Both web and Slack
5. **UI components** - AgentCard
6. **UI pages** - Listing and detail
7. **Integration** - Update service/team pages
8. **Graph** - Add to visualisation

---

## Success Criteria

- [ ] 4 demo agents visible at `/agents`
- [ ] Agent detail pages show all metadata
- [ ] Query "what agents does DSO run" returns results
- [ ] Slack bot answers agent queries
- [ ] Service pages show consuming agents
- [ ] Team pages show owned agents
- [ ] Knowledge graph includes agent nodes
