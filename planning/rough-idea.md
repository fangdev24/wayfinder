# Rough Idea: Data Sharing Agreements Feature

## Source
- **Session**: PDD Session 2026-01-12
- **Status**: Requirements Clarification

## User Need

The data sharing team frequently gets asked: "Does a data share exist between X (external party) and our department, and what data is currently being shared?" This is a common question across government departments.

## Current Gap

Wayfinder tracks service-to-service dependencies but not formal Data Sharing Agreements (DSAs). Users can see that "eligibility-api consumes income-verification-api" but cannot see:
- The legal basis (e.g., DSA-2024-0456)
- What specific data elements flow (NI number, income bands)
- External parties involved (not just government departments)
- Agreement status and dates

## Proposed Solution

Add a new entity type: DataSharingAgreement

```typescript
interface DataSharingAgreement {
  id: string;
  name: string;
  description: string;
  parties: {
    provider: string;      // Department or external org providing data
    consumers: string[];   // Departments/orgs receiving data
  };
  legalBasis: string;      // 'DSA-2024-0456' or 'GDPR Article 6(1)(e)'
  dataElements: string[];  // ['national-insurance-number', 'income-bands', 'address']
  services: string[];      // Service IDs that implement this agreement
  purpose: string;         // Why data is shared
  status: 'active' | 'pending' | 'expired' | 'under-review';
  effectiveDate: string;
  reviewDate?: string;
  expiryDate?: string;
  tags: string[];
}
```

## Requirements

1. **Data layer**: Add DataSharingAgreement to schema, create demo data (5-8 realistic examples), export from data-source
2. **List page**: `/agreements` - shows all DSAs with filtering by status, party, data element
3. **Detail page**: `/agreements/[id]` - shows full agreement details, linked services, related policies
4. **Graph integration**: Add DSA nodes (new shape/color) with edges to services and policies
5. **Search integration**: Enable queries like "What data do we share with HMRC?" or "Show agreements involving income data"
6. **Stats panel**: Add agreements count to homepage stats
7. **Navigation**: Add "Data Sharing" to main nav

## Patterns to Follow

- Use existing patterns from services, policies, and patterns entities
- Follow GOV.UK Design System components
- Use existing GraphNode/GraphEdge types
- Integrate with existing search in `lib/data.ts`

## Demo Data Examples

1. DCS ↔ RTS: Income verification for benefit eligibility
2. DCS ↔ BIA: Identity verification for citizen portal
3. RTS ↔ NHDS: Health data for disability benefit assessments
4. VLA ↔ BIA: Identity checks for licence applications
5. Cross-gov: Data sharing with local authorities (external party example)

## Context

This follows the Agent Architecture implementation pattern (ADR-003), adding a new entity type to the Wayfinder knowledge graph with full UI and query support.
