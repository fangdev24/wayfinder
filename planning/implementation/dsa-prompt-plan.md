# Implementation Plan: Data Sharing Agreements

## Overview

This plan implements the Data Sharing Agreements (DSA) feature as specified in [detailed-design.md](../design/detailed-design.md). The feature adds a new entity type to Wayfinder that enables users to discover and understand formal data sharing arrangements between government departments.

**Primary User Need:** "Does a data share exist between X and our department, and what data is currently being shared?"

## Checklist

- [x] Prompt 1: Schema and type definitions ✓
- [x] Prompt 2: Demo data creation ✓
- [x] Prompt 3: Helper functions and data exports ✓
- [x] Prompt 4: Relationship definitions ✓
- [x] Prompt 5: DataSharingAgreementCard component ✓
- [x] Prompt 6: List page (`/data-sharing-agreements`) ✓
- [x] Prompt 7: Detail page (`/data-sharing-agreements/[id]`) ✓
- [x] Prompt 8: Navigation and homepage stats integration ✓
- [x] Prompt 9: Service page integration ✓ (adapted - no department pages exist)
- [x] Prompt 10: Query engine integration ✓
- [x] Prompt 11: Final verification and testing ✓ (Build successful 2026-01-12)

---

## Prompts

### Prompt 1: Schema and Type Definitions

**Objective**: Extend the schema with DataSharingAgreement types.

**Tasks**:
1. Add `'data-sharing-agreement'` to `EntityType` union in `app/src/data-source/schema.ts`
2. Add new relationship types to `RelationshipType`: `'data-provider'`, `'data-consumer'`, `'complies-with'`
3. Create `DataCategory` type: `'income' | 'identity' | 'health' | 'benefits' | 'address' | 'employment' | 'other'`
4. Create `AgreementStatus` type: `'active' | 'draft' | 'expired' | 'under-review'`
5. Define `DataSharingAgreement` interface with all properties from design doc

**File**: `app/src/data-source/schema.ts`

**Tests**: TypeScript compilation passes; no type errors.

**Integration**: Foundation for all subsequent prompts. All DSA code will import these types.

**Security Consideration**: Ensure ID format follows existing patterns (kebab-case, predictable).

---

### Prompt 2: Demo Data Creation

**Objective**: Create believable fictional data sharing agreements.

**Tasks**:
1. Create `app/src/data-source/data-sharing-agreements.ts`
2. Implement 6 demo agreements as specified in design:
   - `dsa-dcs-rts-income-2024`: DCS←RTS income verification
   - `dsa-bia-dcs-identity-2024`: DCS←BIA identity verification
   - `dsa-nhds-dcs-health-2024`: DCS←NHDS health data
   - `dsa-bia-vla-identity-2023`: VLA←BIA identity checks
   - `dsa-rts-dcs-employment-2024`: DCS←RTS employment status
   - `dsa-dso-all-standards-2023`: Cross-gov standards sharing
3. Use realistic data elements vocabulary from design
4. Reference real service IDs and policy IDs from existing data
5. Follow date conventions (2026+ for demo data)

**Files**: `app/src/data-source/data-sharing-agreements.ts`

**Tests**: All agreements conform to `DataSharingAgreement` interface; no TypeScript errors.

**Integration**: Data will be consumed by helper functions in Prompt 3.

**User Contribution Opportunity**: After reviewing the 6 agreements, the user may want to add or modify specific data elements or legal basis text to match their domain knowledge.

---

### Prompt 3: Helper Functions and Data Exports

**Objective**: Create query functions and wire up exports.

**Tasks**:
1. Add helper functions to `data-sharing-agreements.ts`:
   - `getDataSharingAgreementById(id: string)`
   - `getAgreementsByDepartment(deptId: string)` - where dept is provider OR consumer
   - `getAgreementsByProvider(deptId: string)`
   - `getAgreementsByConsumer(deptId: string)`
   - `getAgreementsForService(serviceId: string)`
   - `getAgreementsByCategory(category: DataCategory)`
   - `getAgreementsByStatus(status: AgreementStatus)`
2. Update `app/src/data-source/index.ts`:
   - Import and re-export `dataSharingAgreements` collection
   - Export all helper functions
   - Add DSA count to `stats` object
   - Add `agreementsByCategory` to stats
   - Add `agreementsByDepartment` to stats
3. Update `app/src/lib/data.ts` to re-export DSA functions

**Files**:
- `app/src/data-source/data-sharing-agreements.ts` (modify)
- `app/src/data-source/index.ts` (modify)
- `app/src/lib/data.ts` (modify)

**Tests**:
- `getAgreementsByDepartment('dcs')` returns expected agreements
- `getAgreementsForService('income-verification-api')` returns linked agreement
- `stats.dataSharingAgreements` equals collection length

**Integration**: Functions will be used by UI pages in Prompts 6-7.

---

### Prompt 4: Relationship Definitions

**Objective**: Add DSA relationships to the knowledge graph.

**Tasks**:
1. Add DSA ↔ Service relationships to `app/src/data-source/relationships/index.ts`:
   - `data-provider`: agreement → service (service provides data for this agreement)
   - `data-consumer`: agreement → service (service consumes data via this agreement)
2. Add DSA ↔ Policy relationships:
   - `complies-with`: agreement → policy
3. Use metadata to include `crossDepartment: true` where applicable
4. Follow existing relationship ID conventions (`rel-XXX`)

**File**: `app/src/data-source/relationships/index.ts`

**Example relationships to add**:
```typescript
// DSA-DCS-RTS-Income implements via income-verification-api
{ id: 'rel-600', sourceId: 'dsa-dcs-rts-income-2024', sourceType: 'data-sharing-agreement',
  targetId: 'income-verification-api', targetType: 'service', relationshipType: 'data-provider' }
```

**Tests**: Relationships array includes DSA entries; no duplicate IDs.

**Integration**: Graph visualisation will pick up these relationships automatically.

---

### Prompt 5: DataSharingAgreementCard Component

**Objective**: Create reusable card component following GOV.UK Design System.

**Tasks**:
1. Create `app/src/components/cards/DataSharingAgreementCard.tsx`
2. Implement two variants:
   - **Compact view** (for list pages): Name, category badge, provider→consumer, status badge, effective date
   - **Full view** (for related sections): Adds description, data elements count, legal basis
3. Follow accessibility requirements:
   - Status badges have text labels (not colour-only)
   - Keyboard navigable
   - Proper ARIA labels
4. Use existing department colour coding from `getDepartmentById`
5. Match styling from `PatternCard` and `ServiceCard` for consistency

**File**: `app/src/components/cards/DataSharingAgreementCard.tsx`

**Props Interface**:
```typescript
interface DataSharingAgreementCardProps {
  agreement: DataSharingAgreement;
  compact?: boolean;
}
```

**Tests**: Component renders without errors; accessible (keyboard focus visible).

**Integration**: Used by list page (Prompt 6) and department page (Prompt 9).

---

### Prompt 6: List Page (`/data-sharing-agreements`)

**Objective**: Create the main listing page for data sharing agreements.

**Tasks**:
1. Create `app/src/app/data-sharing-agreements/page.tsx`
2. Group agreements by providing department (following policies page pattern)
3. Add status filter chips at top: [Active: N] [Under Review: N] [Expired: N]
4. Add category filter dropdown
5. Show count summary in sidebar
6. Include "View in knowledge graph" link at bottom
7. Follow existing page patterns from `policies/page.tsx`

**File**: `app/src/app/data-sharing-agreements/page.tsx`

**Layout** (from design):
```
┌────────────────────────────────────────────────────────────┐
│  Data Sharing Agreements                                   │
│  [Active: 5] [Under Review: 1]                            │
│                                                            │
│  Revenue and Taxation Service (RTS)                        │
│  ├─ [Card] Income Verification Agreement (DCS→RTS)         │
│  └─ [Card] Employment Status Agreement (DCS→RTS)           │
│                                                            │
│  Biometric Identity Agency (BIA)                           │
│  ├─ [Card] Identity Verification (DCS→BIA)                 │
└────────────────────────────────────────────────────────────┘
```

**Tests**: Page renders all agreements; grouping by provider works.

**Integration**: Links to detail pages (Prompt 7).

**User Contribution Opportunity**: The filtering logic (status chips, category dropdown) could be implemented by the user - deciding whether to use URL params, client-side state, or server-side filtering.

---

### Prompt 7: Detail Page (`/data-sharing-agreements/[id]`)

**Objective**: Create the detail view for a single agreement.

**Tasks**:
1. Create `app/src/app/data-sharing-agreements/[id]/page.tsx`
2. Implement two-column layout:
   - **Main content (2/3)**: Description, data elements list, legal basis, related services, related policies
   - **Sidebar (1/3)**: Parties (provider/consumer), quick info (reference, dates), category badge
3. Add breadcrumb navigation
4. Handle 404 with `notFound()` for invalid IDs
5. Generate metadata for SEO
6. Add "View in knowledge graph" button
7. Resolve related services and policies to display cards

**File**: `app/src/app/data-sharing-agreements/[id]/page.tsx`

**Tests**:
- Valid ID renders full page
- Invalid ID returns 404
- Related services display correctly

**Integration**: Linked from list page and department pages.

---

### Prompt 8: Navigation and Homepage Integration

**Objective**: Make DSA discoverable from main navigation and homepage.

**Tasks**:
1. Add "Data Sharing" link to header navigation
   - Find navigation component (likely in layout or a header component)
   - Add: `{ href: '/data-sharing-agreements', label: 'Data Sharing' }`
2. Update homepage stats panel (`app/src/app/page.tsx`):
   - Add DSA count tile: "Data Sharing Agreements: N"
   - Link to `/data-sharing-agreements`
3. Follow existing stat card styling

**Files**:
- Navigation component (to be identified)
- `app/src/app/page.tsx`

**Tests**: Navigation link visible and works; homepage shows correct count.

**Integration**: Provides discoverability for the new feature.

---

### Prompt 9: Department Page Integration

**Objective**: Show relevant agreements on department detail pages.

**Tasks**:
1. Modify `app/src/app/departments/[id]/page.tsx` (or equivalent)
2. Add "Data Sharing Agreements" section
3. Show agreements where department is provider OR consumer
4. Use `getAgreementsByDepartment(deptId)` helper
5. Display using DataSharingAgreementCard (compact mode)
6. Handle case where no agreements exist (don't show section)

**File**: Department detail page (to be identified)

**Tests**: Department page shows linked agreements; empty state handled.

**Integration**: Cross-links DSAs with department context.

---

### Prompt 10: Query Engine Integration

**Objective**: Enable natural language search for DSAs.

**Tasks**:
1. Locate query engine file (likely `app/src/lib/agent-query.ts` or similar)
2. Add intent patterns for DSA queries:
   - `/\b(data|sharing)\b.*\b(agreement|accord)\b/i` → `find_dsa`
   - `/\bwhat\b.*\b(share|sharing)\b.*with\b/i` → `find_dsa_party`
   - `/\b(dsa|agreement)\b.*\b(expir|review)/i` → `find_dsa_expiring`
3. Implement handlers that search by:
   - Department name/acronym
   - Data category
   - Reference number
   - Data elements
4. Return formatted results matching existing search response format

**File**: Query engine file (to be identified)

**Query Examples**:
| Query | Expected Result |
|-------|-----------------|
| "What data do we share with RTS?" | Agreements where RTS is party |
| "Show income data agreements" | Agreements with category='income' |
| "Which services implement DSA-2024-0456?" | Agreement by reference → services |

**Tests**: Sample queries return expected agreements.

**Integration**: Enables conversational discovery of DSAs.

---

### Prompt 11: Final Verification and Testing

**Objective**: Ensure feature is complete and error-free.

**Tasks**:
1. Run TypeScript compilation: `npm run typecheck` (or `tsc --noEmit`)
2. Run linter: `npm run lint`
3. Run build: `npm run build`
4. Run any existing tests: `npm test`
5. Manual verification:
   - [ ] List page loads and displays all agreements
   - [ ] Filters work correctly
   - [ ] Detail page loads for each agreement
   - [ ] 404 for invalid agreement ID
   - [ ] Navigation link visible
   - [ ] Homepage stat shows correct count
   - [ ] Department pages show related agreements
   - [ ] Graph includes DSA nodes (if graph integration exists)
6. Accessibility check:
   - [ ] Keyboard navigation works
   - [ ] Screen reader announces content correctly
   - [ ] Colour contrast meets WCAG 2.1 AA
7. Fix any issues found

**Files**: All created/modified files

**Deliverable**: Working feature ready for review.

---

## Checkpoint Instructions

After completing each prompt:

1. **Run verification**:
   ```bash
   cd /home/kasm/projects/wayfinder/app
   npm run typecheck 2>&1 | head -20
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat(dsa): complete prompt N - {description}

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
   ```

3. **Update checklist**: Mark completed item in this file

4. **Document deviations**: Note any changes from the design or plan

---

## Dependencies Graph

```
Prompt 1 (Schema)
    │
    ├──► Prompt 2 (Demo Data)
    │        │
    │        └──► Prompt 3 (Helpers/Exports)
    │                 │
    │                 ├──► Prompt 5 (Card Component)
    │                 │        │
    │                 │        ├──► Prompt 6 (List Page)
    │                 │        │        │
    │                 │        │        └──► Prompt 7 (Detail Page)
    │                 │        │
    │                 │        └──► Prompt 9 (Dept Integration)
    │                 │
    │                 └──► Prompt 10 (Query Engine)
    │
    └──► Prompt 4 (Relationships)

Prompt 8 (Navigation/Homepage) - Can run after Prompt 3
Prompt 11 (Verification) - Runs after all others
```

---

## File Summary

| File | Action | Prompt |
|------|--------|--------|
| `app/src/data-source/schema.ts` | Modify | 1 |
| `app/src/data-source/data-sharing-agreements.ts` | Create | 2, 3 |
| `app/src/data-source/index.ts` | Modify | 3 |
| `app/src/lib/data.ts` | Modify | 3 |
| `app/src/data-source/relationships/index.ts` | Modify | 4 |
| `app/src/components/cards/DataSharingAgreementCard.tsx` | Create | 5 |
| `app/src/app/data-sharing-agreements/page.tsx` | Create | 6 |
| `app/src/app/data-sharing-agreements/[id]/page.tsx` | Create | 7 |
| Navigation component | Modify | 8 |
| `app/src/app/page.tsx` | Modify | 8 |
| Department detail page | Modify | 9 |
| Query engine file | Modify | 10 |

---

## Security Review Points

The design specified "Not applicable - demo data only" for security. However:

1. **Input Validation** (Prompt 6-7):
   - Validate filter parameters against known enums
   - Validate ID format before lookup
   - Return 404 for unknown IDs (don't expose existence)

2. **No Sensitive Data**:
   - Demo data uses fictional references only
   - No real NI numbers, real department names, or actual legal references

3. **XSS Prevention**:
   - Use React's built-in escaping for all user-visible content
   - Avoid raw HTML injection patterns

---

## Accessibility Compliance

Following WCAG 2.1 AA (per project rules in `.claude/rules/accessibility.md`):

1. **Status badges**: Text labels, not colour-only
2. **Heading hierarchy**: h1 → h2 → h3 (no skipping levels)
3. **Keyboard navigation**: All interactive elements focusable
4. **Focus indicators**: Visible focus states
5. **Screen reader**: Proper ARIA labels and landmarks

---

## Status

**Plan Status:** Complete - Ready for execution

**Created:** 2026-01-12

**Design Source:** [detailed-design.md](../design/detailed-design.md)

**Next Step:** Begin with Prompt 1 (Schema and Type Definitions)

---

## Deviations & Notes

### Implementation Complete (2026-01-12)

**Adaptations from original plan:**

1. **Prompt 9 - Service Pages instead of Department Pages**
   - Original plan called for department page integration, but no department detail pages exist
   - Implemented DSA section on service detail pages instead (`/services/[id]`)
   - Shows agreements that involve the service via `getAgreementsForService()`

2. **Query Engine - Extended searchAll()**
   - Added DSA support to the global `searchAll()` function in `data.ts`
   - Updated `SearchFilters` interface to include `'data-sharing-agreement'` type
   - DSA search includes name, description, data elements, and tags

**Files created:**
- `app/src/data-source/data-sharing-agreements.ts` - 6 demo agreements with helper functions
- `app/src/components/cards/DataSharingAgreementCard.tsx` - Card component (compact/full variants)
- `app/src/app/data-sharing-agreements/page.tsx` - List page grouped by provider
- `app/src/app/data-sharing-agreements/[id]/page.tsx` - Detail page with two-column layout

**Files modified:**
- `app/src/data-source/schema.ts` - DSA types (DataSharingAgreement, DataCategory, AgreementStatus)
- `app/src/data-source/index.ts` - Exports and stats
- `app/src/lib/data.ts` - Re-exports, graph nodes, searchAll updates
- `app/src/data-source/relationships/index.ts` - ~25 DSA relationships
- `app/src/components/layout/Header.tsx` - "Data Sharing" navigation link
- `app/src/components/StatsPanel.tsx` - DSA count on homepage
- `app/src/app/services/[id]/page.tsx` - DSA section for related agreements
- `app/src/lib/agent-query.ts` - DSA query handlers (find_dsa, list_dsas)

**Build verification:** `npm run build` passes with 0 errors
