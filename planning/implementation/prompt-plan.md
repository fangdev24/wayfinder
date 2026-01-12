# Implementation Plan: Agent Architecture (ADR-003)

## Checklist

- [x] **Prompt 1**: Schema & Type Definitions ✓
- [x] **Prompt 2**: Demo Agent Data ✓
- [x] **Prompt 3**: Agent Relationships ✓
- [x] **Prompt 4**: Data Layer Integration ✓
- [x] **Prompt 5**: Query Engine - Web UI ✓
- [x] **Prompt 6**: Query Engine - Slack Bot ✓
- [x] **Prompt 7**: UI Component - AgentCard ✓
- [x] **Prompt 8**: UI Page - Agent Listing ✓
- [x] **Prompt 9**: UI Page - Agent Detail ✓
- [x] **Prompt 10**: Integration - Service & Team Pages ✓
- [x] **Prompt 11**: Integration - Knowledge Graph ✓
- [x] **Prompt 12**: Verification & Polish ✓ (Build successful 2026-01-12)

---

## Prompts

### Prompt 1: Schema & Type Definitions

**Objective**: Add all Agent-related types to the schema.

**Files**:
- `app/src/data-source/schema.ts` (modify)

**Tasks**:
1. Add `AgentType` union type (6 values)
2. Add `AgentStatus` union type (4 values)
3. Add `AgentCapability` interface
4. Add `AgentPermission` interface
5. Add `PermissionCondition` interface
6. Add `Agent` interface (full schema from ADR-003)
7. Add `AgentAuditEntry` interface
8. Extend `EntityType` to include `'agent'`
9. Extend `RelationshipType` with agent relationships (`owned-by`, `governed-by`)
10. Update `DemoDataset` interface to include `agents?: Agent[]`

**Test**: TypeScript compiles without errors.

**Integration**: Foundation for all subsequent prompts.

---

### Prompt 2: Demo Agent Data

**Objective**: Create the 4 demo agents with full metadata from ADR-003.

**Files**:
- `app/src/data-source/agents.ts` (create)

**Tasks**:
1. Create `wayfinder-discovery` agent (DSO, discovery type)
2. Create `deploy-bot-revenue` agent (RTS, operations type)
3. Create `policy-enforcer` agent (DSO, compliance type)
4. Create `ministerial-triage-dcs` agent (DCS, support type)
5. Add helper functions: `getAgentById`, `getAgentsByDepartment`, `getAgentsByTeam`, `getAgentsByType`

**Data sources**: Copy exact data from ADR-003 sections "Demo Agent Seed Data".

**Test**: Import and verify all 4 agents have valid data.

**Integration**: Agents available for export in next prompt.

---

### Prompt 3: Agent Relationships

**Objective**: Add agent relationships to the knowledge graph.

**Files**:
- `app/src/data-source/relationships.ts` (modify)

**Tasks**:
1. Add agent→team (owned-by) relationships for all 4 agents
2. Add agent→service (consumes) relationships based on `consumesServices` field
3. Assign relationship IDs following existing pattern (`rel-agent-XXX`)

**Relationships to add** (approximate):
- `wayfinder-discovery` → `granite-platform` (owned-by)
- `wayfinder-discovery` → `neptune-graph`, `opensearch-index` (consumes)
- `deploy-bot-revenue` → `falcon-core` (owned-by)
- `deploy-bot-revenue` → `gov-cloud-platform`, `github-actions` (consumes)
- `policy-enforcer` → `governance-team` (owned-by)
- `policy-enforcer` → `wayfinder-api`, `policy-registry` (consumes)
- `ministerial-triage-dcs` → `private-office` (owned-by)
- `ministerial-triage-dcs` → `email-gateway`, `bedrock-claude` (consumes)

**Test**: Relationships parse without errors.

**Integration**: Graph now includes agents.

---

### Prompt 4: Data Layer Integration

**Objective**: Export agents through the data layer for app consumption.

**Files**:
- `app/src/data-source/index.ts` (modify)
- `app/src/lib/data.ts` (modify)

**Tasks**:
1. Import agents and helpers in `data-source/index.ts`
2. Add agents to `demoDataset` object
3. Export `agents` and agent helper functions
4. Update `stats` to include agent counts
5. In `lib/data.ts`, re-export agents and helpers
6. Add `Agent` type to exports
7. Add `searchAll` filter support for agents
8. Update `GraphNode` type to include `'agent'`
9. Update `getGraphData()` to include agent nodes

**Test**: `import { agents } from '@/lib/data'` works.

**Integration**: Agents now available to all app components.

---

### Prompt 5: Query Engine - Web UI

**Objective**: Add agent query capabilities to the web query engine.

**Files**:
- `app/src/lib/agent-query.ts` (modify)

**Tasks**:
1. Add `'find_agent' | 'list_agents'` to `QueryIntent` type
2. Add `'agent'` to `QueryEntity.type`
3. Add intent patterns for agent queries:
   - `/\b(what|which|show|find)\b.*(agent|bot)/i` → find_agent
   - `/\bagent(s)?\b.*(for|runs?|does)/i` → find_agent
   - `/\bwho\b.*(deploy|automat)/i` → find_agent
   - `/\b(list|show|all)\b.*agents?\b/i` → list_agents
4. Add `extractAgentType()` helper
5. Implement `handleFindAgent()` handler
6. Implement `handleListAgents()` handler
7. Add agent cases to `processQuery()` switch

**Test**: Query "what agents does DSO run" returns results.

**Integration**: Web UI query interface can find agents.

---

### Prompt 6: Query Engine - Slack Bot

**Objective**: Add agent query capabilities to the Slack bot.

**Files**:
- `slack-bot/src/query.ts` (modify)

**Tasks**:
1. Import agents from demo-data
2. Add agent types to `QueryIntent` and `QueryEntity`
3. Add same intent patterns as web UI
4. Implement `handleFindAgent()` (mirror web UI logic)
5. Implement `handleListAgents()` (mirror web UI logic)
6. Update `handleGeneralSearch()` to include agents
7. Update `processSlackQuery()` switch statement

**Test**: Slack bot processes "@wayfinder what agents run deployments".

**Integration**: Slack bot can answer agent queries.

---

### Prompt 7: UI Component - AgentCard

**Objective**: Create reusable agent card component matching existing patterns.

**Files**:
- `app/src/components/cards/AgentCard.tsx` (create)

**Tasks**:
1. Create component with props: `agent: Agent`
2. Display: name, type badge, status badge, description excerpt
3. Match styling of `ServiceCard` and `TeamCard`
4. Add type-specific icon/color (or use type badge color)
5. Link to `/agents/[id]` detail page
6. Show department and team info

**Reference**: Follow `ServiceCard.tsx` structure exactly.

**Test**: Component renders without errors.

**Integration**: Used by listing page.

---

### Prompt 8: UI Page - Agent Listing

**Objective**: Create `/agents` page with filtering and search.

**Files**:
- `app/src/app/agents/page.tsx` (create)

**Tasks**:
1. Create page component with metadata
2. Add page header "Agents"
3. Add filter controls:
   - Type filter (all, discovery, operations, compliance, data, intelligence, support)
   - Department filter (dropdown)
   - Status filter (active, testing, suspended, retired)
4. Display agent cards in grid layout
5. Show total count
6. Handle empty state

**Reference**: Follow `app/src/app/services/page.tsx` structure.

**Test**: Page loads at `/agents` and shows 4 agents.

**Integration**: Main navigation should link here (optional).

---

### Prompt 9: UI Page - Agent Detail

**Objective**: Create `/agents/[id]` page with full agent information.

**Files**:
- `app/src/app/agents/[id]/page.tsx` (create)

**Tasks**:
1. Create dynamic route page
2. Page header: name, type badge, status badge
3. Section: Description
4. Section: Capabilities table (name, description, risk level, approval needed)
5. Section: Services Consumed (linked cards)
6. Section: Permissions (collapsible, human-readable)
7. Section: Governance (approved by, review date, owning team link)
8. Section: Metadata (version, repository link, created/last active dates)
9. Handle 404 for unknown agent ID

**Reference**: Follow `app/src/app/services/[id]/page.tsx` structure.

**Test**: `/agents/wayfinder-discovery` shows full details.

**Integration**: Links from AgentCard work correctly.

---

### Prompt 10: Integration - Service & Team Pages

**Objective**: Show agents on related entity pages.

**Files**:
- `app/src/app/services/[id]/page.tsx` (modify)
- `app/src/app/teams/[id]/page.tsx` (modify)

**Tasks**:
1. **Service page**: Add "Consumed by Agents" section
   - Query: `agents.filter(a => a.consumesServices.includes(service.id))`
   - Display small agent cards or list
   - Only show if agents exist
2. **Team page**: Add "Agents Owned by Team" section
   - Query: `agents.filter(a => a.teamId === team.id)`
   - Display agent cards
   - Only show if agents exist

**Test**: Service page for `api-gateway` may show consuming agents.

**Integration**: Cross-navigation between entities.

---

### Prompt 11: Integration - Knowledge Graph

**Objective**: Add agent nodes to the graph visualisation.

**Files**:
- `app/src/lib/data.ts` (verify already done in Prompt 4)
- `app/src/components/graph/GraphCanvas.tsx` (modify if needed)
- `app/src/components/graph/GraphLegend.tsx` (modify)

**Tasks**:
1. Verify `getGraphData()` includes agent nodes
2. Add agent node styling (distinct colour - suggest purple or teal)
3. Update graph legend to show agent node type
4. Ensure agent nodes are clickable → navigate to detail page

**Colour suggestion**: Use `#8b5cf6` (violet-500) for agents.

**Test**: Graph shows agent nodes connected to services/teams.

**Integration**: Complete knowledge graph with all entity types.

---

### Prompt 12: Verification & Polish

**Objective**: Final verification and cleanup.

**Tasks**:
1. Run `npm run build` in app directory
2. Fix any TypeScript errors
3. Verify all pages load without errors
4. Test query "what agents does DSO run" in web UI
5. Verify all 4 agents appear in listing
6. Verify all 4 agent detail pages work
7. Check service pages show consuming agents (if any)
8. Check team pages show owned agents
9. Verify graph shows agent nodes
10. Update ADR-003 status to "Implemented"

**Success Criteria** (from design):
- [ ] 4 demo agents visible at `/agents`
- [ ] Agent detail pages show all metadata
- [ ] Query "what agents does DSO run" returns results
- [ ] Service pages show consuming agents
- [ ] Team pages show owned agents
- [ ] Knowledge graph includes agent nodes

---

## Checkpoint Instructions

After completing each prompt:

1. **Run verification**:
   ```bash
   cd /home/kasm/projects/wayfinder/app
   npm run build
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat(agents): complete prompt N - {description}

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```

3. **Update this checklist** - mark completed prompt

4. **Note any issues** - document deviations below

---

## Deviations & Notes

### Implementation Complete (2026-01-12)

**Enhancements beyond original plan:**
1. Added 5th agent (`ministerial-triage-rts`) to demonstrate agent cloning/lineage feature
2. Added `clonedFrom` field to Agent schema for lineage tracking
3. Added `agent-consumes` edge type for distinct graph styling
4. Created comprehensive helper functions for agent queries

**Files created/modified:**
- `app/src/data-source/schema.ts` - All agent types
- `app/src/data-source/agents.ts` - 5 demo agents
- `app/src/data-source/relationships/index.ts` - Agent relationships
- `app/src/data-source/index.ts` - Exports and stats
- `app/src/lib/data.ts` - Data layer with GraphNode updates
- `app/src/lib/agent-query.ts` - Web query engine
- `slack-bot/src/query.ts` - Slack bot integration
- `app/src/components/cards/AgentCard.tsx` - Card component
- `app/src/app/agents/page.tsx` - Listing page
- `app/src/app/agents/[id]/page.tsx` - Detail page
- `app/src/app/services/[id]/page.tsx` - Agent consumers section
- `app/src/app/teams/[id]/page.tsx` - Team agents section
- `app/src/components/graph/GraphLegend.tsx` - Agent node type

**Build verification:** `npm run build` passes with 0 TypeScript errors

---

## File Summary

| Prompt | File | Action |
|--------|------|--------|
| 1 | `app/src/data-source/schema.ts` | Modify |
| 2 | `app/src/data-source/agents.ts` | Create |
| 3 | `app/src/data-source/relationships.ts` | Modify |
| 4 | `app/src/data-source/index.ts` | Modify |
| 4 | `app/src/lib/data.ts` | Modify |
| 5 | `app/src/lib/agent-query.ts` | Modify |
| 6 | `slack-bot/src/query.ts` | Modify |
| 7 | `app/src/components/cards/AgentCard.tsx` | Create |
| 8 | `app/src/app/agents/page.tsx` | Create |
| 9 | `app/src/app/agents/[id]/page.tsx` | Create |
| 10 | `app/src/app/services/[id]/page.tsx` | Modify |
| 10 | `app/src/app/teams/[id]/page.tsx` | Modify |
| 11 | `app/src/components/graph/GraphLegend.tsx` | Modify |
