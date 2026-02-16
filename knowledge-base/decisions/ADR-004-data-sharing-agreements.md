# ADR-004: Data Sharing Agreements Entity

## Status

Accepted

## Context

Wayfinder currently tracks service-to-service dependencies and technical relationships, but lacks visibility into the governance layer - specifically, formal Data Sharing Agreements (DSAs) between government departments.

Users frequently ask: "Does a data share exist between X and our department, and what data is currently being shared?" The current data model cannot answer this because:

1. Service dependencies show technical flow, not legal agreements
2. No visibility into what specific data elements are shared
3. No link to legal basis or compliance requirements
4. No agreement lifecycle tracking (effective dates, review dates)

## Decision

Add a new `DataSharingAgreement` entity type to Wayfinder with:

1. **Core properties**: id, name, description, reference (DSA number), legal basis
2. **Parties**: providingDepartmentId, consumingDepartmentId (using existing departments)
3. **Data details**: category (income/identity/health/etc.), dataElements array
4. **Lifecycle**: status, effectiveDate, reviewDate, expiryDate
5. **Relationships**: links to services and policies

This follows the established entity pattern (services, policies, agents) and integrates with:
- Relationship graph (DSA nodes connected to services/policies)
- Query engine (natural language search)
- UI (list and detail pages)

## Consequences

### Positive

- Answers the key user question about data sharing arrangements
- Completes the governance visibility layer (services + policies + agreements)
- Enables queries like "What data do we share with HMRC?"
- Demonstrates Wayfinder's extensibility to new entity types

### Negative

- Adds complexity to the data model
- Requires updates to navigation, stats, and query engine
- Demo data must be realistic enough to be useful feedback

### Neutral

- Uses existing patterns - no new architectural concepts
- Single consumer per agreement (simpler than multi-consumer model)
- Data elements are freeform strings (not a controlled vocabulary)

## Implementation

See [planning/design/detailed-design.md](../../planning/design/detailed-design.md) for full specification.

Key files to create/modify:
- `data-source/schema.ts` - Add interface
- `data-source/data-sharing-agreements.ts` - Demo data
- `app/data-sharing-agreements/` - UI pages
- `lib/agent-query.ts` - Query support
