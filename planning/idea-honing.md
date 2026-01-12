# Idea Honing: Agent Architecture Implementation

## Session Log

### Context Established

**Existing Patterns Understood:**
- Schema: `demo-data/schema.ts` - Department, Team, Service, Pattern, Person, Relationship types
- Data: `demo-data/services/*.ts` - Services organised by department
- Relationships: `demo-data/relationships/index.ts` - Graph edges with types
- Query Engine: `app/src/lib/agent-query.ts` and `slack-bot/src/query.ts`
- UI: Next.js pages at `/services`, `/teams`, `/patterns`, `/policies`

**ADR-003 Provides:**
- Complete TypeScript schemas for Agent, AgentAuditEntry, AgentCapability, AgentPermission
- 6 agent types: discovery, operations, compliance, data, intelligence, support
- 4 detailed demo agent examples
- Relationship types: consumes, owned-by, governed-by, delegates-to, reports-to
- 5-phase implementation plan

---

## Requirements Clarification

### Q1: Demo Agents Selection
**Question:** The ADR provides 4 detailed demo agents. Should we use exactly these 4, or would you like a different selection?

ADR's agents:
1. `wayfinder-discovery` (DSO, discovery) - Powers NL search
2. `deploy-bot-revenue` (RTS, operations) - Automated deployments
3. `policy-enforcer` (DSO, compliance) - Policy validation
4. `ministerial-triage-dcs` (DCS, support) - Correspondence triage

Alternative options from ADR taxonomy:
- `accessibility-checker` (DSO, compliance)
- `pod-sync-agent` (per dept, data)
- `pattern-suggester` (DSO, intelligence)

**Answer:** Use ADR's 4 agents exactly:
1. `wayfinder-discovery` (DSO, discovery)
2. `deploy-bot-revenue` (RTS, operations)
3. `policy-enforcer` (DSO, compliance)
4. `ministerial-triage-dcs` (DCS, support)

These cover 4 of 6 types and have complete seed data in ADR-003.

---

## Requirements Summary

**Scope confirmed:**
- 4 demo agents from ADR-003
- Follow existing patterns (services, teams, patterns)
- Extend EntityType to include 'agent'
- Add to both web UI and Slack bot query engines
- Create `/agents` and `/agents/[id]` pages
