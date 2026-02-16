# Idea Honing: Data Sharing Agreements

## Session Log

### Context Established

**Feature Purpose:**
Enable users to discover and understand formal Data Sharing Agreements (DSAs) between government departments and external parties.

**Key User Question:**
"Does a data share exist between X and our department, and what data is currently being shared?"

**Existing Patterns to Follow:**
- Services: `app/src/data-source/services/`
- Agents: `app/src/data-source/agents.ts`
- Policies: Policy entities in schema
- Query engine: `app/src/lib/agent-query.ts`
- UI pages: `/services`, `/agents`, `/policies`

---

## Requirements Clarification

### Q1: External Parties
**Question:** How should we model external organizations (HMRC, local authorities) that aren't departments in the current data model?

**Answer:** Use existing fictional departments only. For HMRC, use "Revenue and Taxation Service" (RTS). Leave out local authorities for now. Keep it simple with existing departments to demonstrate the query patterns.

**Key queries to support:**
- "What data do we share with HMRC?" → Lists agreements, data elements, legal basis
- "Show all agreements expiring this year"
- "Which services implement DSA-2024-0456?"

---

### Q2: Data Elements Vocabulary
**Question:** Should data elements use a controlled vocabulary or free text?

**Answer:** Keep it simple - this is a demo to give a "feel" of how it might work in practice. Use a predefined list of common data elements for consistency in demo data, but no need to over-engineer. Goal is to generate feedback.

**Decision:** Use simple string array with consistent naming in demo data (e.g., `national-insurance-number`, `income-bands`, `address`). Not a strict enum.

---

## Requirements Summary

**Scope confirmed:**
- New `DataSharingAgreement` entity type
- Use existing departments only (no external org entity needed)
- Simple string arrays for data elements
- 5-8 demo agreements between fictional departments
- Demo-focused to generate feedback

**Key queries to support:**
1. "What data do we share with RTS?" → agreements + data elements + legal basis
2. "Show all agreements expiring this year" → date-based filtering
3. "Which services implement DSA-2024-0456?" → agreement → service linkage

**Deliverables:**
1. Schema: `DataSharingAgreement` interface
2. Demo data: 5-8 realistic examples
3. List page: `/agreements` with filters
4. Detail page: `/agreements/[id]`
5. Graph integration: DSA nodes + edges to services
6. Query engine: NL search support
7. Stats panel + navigation updates

**Status:** Requirements complete → Ready for design
