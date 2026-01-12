# Rough Idea: Implement Agent Architecture (ADR-003)

## Source
- **ADR Reference**: `knowledge-base/decisions/ADR-003-agent-architecture.md`
- **Status**: Proposed → Implementation

## Summary

Implement the Agent Pod layer of Wayfinder's 3-Pod architecture. Agents are autonomous entities that help government teams automate tasks, ensure compliance, and surface insights.

## Key Deliverables

1. **DATA MODEL**: Add `Agent` and `AgentAuditEntry` types to `demo-data/schema.ts`
2. **DEMO DATA**: Create `demo-data/agents/` with 4+ demo agents across 6 types
3. **RELATIONSHIPS**: Add agent relationships to the knowledge graph
4. **QUERY ENGINE**: Extend query engine with `find_agent`, `list_agents` intents
5. **UI PAGES**: Create `/agents` listing and `/agents/[id]` detail pages
6. **INTEGRATION**: Show agents on service and team pages

## Agent Types (6 categories)
- `discovery` - Help find information
- `operations` - Automate routine tasks
- `compliance` - Enforce policies
- `data` - Manage data flows
- `intelligence` - AI-powered analysis
- `support` - Departmental operations (comms, casework, private office)

## Demo Agents from ADR
1. `wayfinder-discovery` (DSO, discovery) - Powers NL search
2. `deploy-bot-revenue` (RTS, operations) - Automated deployments
3. `policy-enforcer` (DSO, compliance) - Policy validation
4. `ministerial-triage-dcs` (DCS, support) - Correspondence triage

## Context

The Wayfinder demo currently has no agents implemented. The ADR provides:
- Complete TypeScript schemas
- Governance policies
- Relationship types
- Demo seed data examples
- 5-phase implementation plan

## Follow Existing Patterns

- Services pattern: `demo-data/services/dso-services.ts`
- Relationships: `demo-data/relationships/index.ts`
- UI pages: `app/src/app/services/`, `app/src/app/teams/`
- Entity types: `EntityType` in `demo-data/schema.ts`
