# Data Sharing Agreements - Detailed Design

## 1. Overview

Add a new `DataSharingAgreement` entity type to Wayfinder, enabling users to discover and understand formal data sharing arrangements between government departments.

**Primary User Need:** "Does a data share exist between X and our department, and what data is currently being shared?"

**Why This Matters:** Wayfinder tracks service-to-service dependencies but not the legal and governance layer. Users can see that "eligibility-api consumes income-verification-api" but cannot see the legal basis (DSA-2024-0456), specific data elements (NI number, income bands), or agreement status/dates.

## 2. Requirements Summary

From idea-honing phase:

| Requirement | Priority | Notes |
|-------------|----------|-------|
| `DataSharingAgreement` schema | Must | New entity type |
| Demo data (5-8 agreements) | Must | Between existing fictional departments |
| List page `/data-sharing-agreements` | Must | With filtering |
| Detail page `/data-sharing-agreements/[id]` | Must | Shows relationships |
| Graph integration | Should | DSA nodes + edges |
| Query engine support | Should | NL search |
| Stats panel + nav updates | Must | Homepage visibility |

**Key Queries to Support:**
1. "What data do we share with RTS?"
2. "Show all agreements expiring this year"
3. "Which services implement DSA-2024-0456?"

## 3. Architecture

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│                     Wayfinder App                            │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Services   │  │   Policies  │  │ DataSharingAgrmnts │  │
│  │   (48)      │  │    (12)     │  │      (5-8)          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│               ┌──────────▼──────────┐                        │
│               │   Relationships     │                        │
│               │   (Graph Layer)     │                        │
│               └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Diagram

```mermaid
graph TD
    subgraph "Data Layer"
        A[schema.ts] --> B[data-sharing-agreements.ts]
        B --> C[data-source/index.ts]
        C --> D[lib/data.ts]
    end

    subgraph "Relationships"
        E[relationships/index.ts]
        E --> F[DSA ↔ Service]
        E --> G[DSA ↔ Policy]
        E --> H[DSA ↔ Department]
    end

    subgraph "UI Layer"
        I[/data-sharing-agreements/page.tsx]
        J[/data-sharing-agreements/id/page.tsx]
        K[DataSharingAgreementCard.tsx]
    end

    subgraph "Query Layer"
        L[agent-query.ts]
    end

    D --> I
    D --> J
    D --> K
    D --> L
    E --> J
```

### Data Flow

1. **Demo data** defined in `data-sharing-agreements.ts`
2. **Exported** via `data-source/index.ts` with helper functions
3. **Re-exported** in `lib/data.ts` for client components
4. **Rendered** by list page (grouped by provider department)
5. **Detail page** fetches agreement + resolves relationships to services/policies
6. **Query engine** matches NL queries to agreements

## 4. Components and Interfaces

### 4.1 Schema Definition

**File:** `app/src/data-source/schema.ts`

```typescript
// Add to EntityType union
export type EntityType =
  | 'department'
  | 'team'
  | 'service'
  | 'pattern'
  | 'policy'
  | 'agent'
  | 'data-sharing-agreement';  // NEW

// New category type
export type DataCategory =
  | 'income'
  | 'identity'
  | 'health'
  | 'benefits'
  | 'address'
  | 'employment'
  | 'other';

// New status type
export type AgreementStatus =
  | 'active'
  | 'draft'
  | 'expired'
  | 'under-review';

// Main interface
export interface DataSharingAgreement {
  id: string;                        // e.g., "dsa-dcs-rts-income-2024"
  name: string;                      // Human-readable title
  description: string;               // Purpose and scope

  // Parties (using existing department IDs)
  providingDepartmentId: string;     // Who provides the data
  consumingDepartmentId: string;     // Who receives the data

  // Agreement details
  reference: string;                 // e.g., "DSA-2024-0456"
  legalBasis: string;                // e.g., "GDPR Article 6(1)(e)"
  category: DataCategory;
  status: AgreementStatus;

  // Data elements being shared
  dataElements: string[];            // e.g., ['national-insurance-number', 'income-bands']

  // Relationships (IDs only, following existing pattern)
  relatedServices: string[];         // Service IDs that implement this
  relatedPolicies: string[];         // Policy IDs it complies with

  // Lifecycle
  effectiveDate: string;             // ISO date
  reviewDate?: string;               // ISO date
  expiryDate?: string;               // ISO date

  // Metadata
  tags: string[];
}
```

### 4.2 Helper Functions

**File:** `app/src/data-source/index.ts` (add to existing)

| Function | Purpose | Signature |
|----------|---------|-----------|
| `getDataSharingAgreementById` | Find by ID | `(id: string) => DataSharingAgreement \| undefined` |
| `getAgreementsByDepartment` | Find where dept is provider OR consumer | `(deptId: string) => DataSharingAgreement[]` |
| `getAgreementsByProvider` | Find where dept provides data | `(deptId: string) => DataSharingAgreement[]` |
| `getAgreementsByConsumer` | Find where dept receives data | `(deptId: string) => DataSharingAgreement[]` |
| `getAgreementsForService` | Find agreements linked to service | `(serviceId: string) => DataSharingAgreement[]` |
| `getAgreementsByCategory` | Filter by data category | `(category: DataCategory) => DataSharingAgreement[]` |
| `getAgreementsByStatus` | Filter by status | `(status: AgreementStatus) => DataSharingAgreement[]` |

### 4.3 API Endpoints (N/A)

This is a static demo application - no API endpoints required. Data is bundled with the Next.js app.

### 4.4 Page Structure

| Route | Purpose | Template |
|-------|---------|----------|
| `/data-sharing-agreements` | List all agreements | Follow `/services` pattern |
| `/data-sharing-agreements/[id]` | Agreement detail | Follow `/services/[id]` pattern |

## 5. Data Models

### 5.1 Demo Data (5-8 Agreements)

| ID | Provider | Consumer | Category | Description |
|----|----------|----------|----------|-------------|
| `dsa-dcs-rts-income-2024` | DCS | RTS | income | Income verification for benefit eligibility |
| `dsa-bia-dcs-identity-2024` | BIA | DCS | identity | Identity verification for citizen portal |
| `dsa-nhds-dcs-health-2024` | NHDS | DCS | health | Health data for disability assessments |
| `dsa-bia-vla-identity-2023` | BIA | VLA | identity | Identity checks for licence applications |
| `dsa-rts-dcs-employment-2024` | RTS | DCS | employment | Employment status for benefit claims |
| `dsa-dso-all-standards-2023` | DSO | all | other | Standards and guidance sharing (cross-gov) |

### 5.2 Data Elements Vocabulary

Using consistent naming for demo data (not a strict enum):

- `national-insurance-number`
- `income-bands`
- `employment-status`
- `address-history`
- `date-of-birth`
- `identity-verification-status`
- `health-condition-codes`
- `benefit-entitlement`
- `driving-licence-number`

### 5.3 Relationships Schema

Add to `relationships/index.ts`:

```typescript
// New relationship types
| 'data-provider'    // agreement -> service (service provides data for agreement)
| 'data-consumer'    // agreement -> service (service consumes data via agreement)
| 'complies-with'    // agreement -> policy

// Example relationships
{
  sourceId: 'dsa-dcs-rts-income-2024',
  sourceType: 'data-sharing-agreement',
  targetId: 'income-verification-api',
  targetType: 'service',
  relationshipType: 'data-provider'
}
```

## 6. Security Considerations

### 6.1 Authentication/Authorization
- **Not applicable** for demo - static site with no sensitive data
- Real implementation would require: role-based access, audit logging

### 6.2 Data Encryption
- **Not applicable** - demo data only, no real DSA information
- Real implementation: encrypt at rest, TLS in transit

### 6.3 Input Validation
- List page: Validate filter parameters (status, category enums)
- Detail page: Validate ID format, return 404 for unknown IDs
- Follow existing patterns from services pages

## 7. Error Handling

### 7.1 Page-Level Errors

| Scenario | Handling | User Message |
|----------|----------|--------------|
| Agreement not found | Return `notFound()` | Standard Next.js 404 page |
| Invalid filter value | Ignore, use default | Show unfiltered list |

### 7.2 Query Engine Errors

| Scenario | Handling | Response |
|----------|----------|----------|
| No matching agreements | Return empty result | "No data sharing agreements found matching your query" |
| Ambiguous query | Return multiple suggestions | "Did you mean: [list options]" |

## 8. Testing Strategy

### 8.1 Unit Tests

| Component | Tests |
|-----------|-------|
| Helper functions | `getAgreementsByDepartment`, `getAgreementsForService` - filter correctly |
| Schema validation | All demo agreements conform to interface |

### 8.2 Integration Tests

| Flow | Test |
|------|------|
| List page render | Shows all agreements grouped by provider |
| Detail page render | Shows agreement with resolved relationships |
| Query matching | "What data do we share with RTS?" returns correct agreements |

### 8.3 E2E Test Scenarios

1. Navigate to `/data-sharing-agreements` → See grouped list
2. Click agreement → See detail page with services/policies
3. Filter by status → List updates correctly
4. Query "income data" → Returns income-category agreements

## 9. UI Components

### 9.1 DataSharingAgreementCard

**File:** `app/src/components/cards/DataSharingAgreementCard.tsx`

```typescript
interface DataSharingAgreementCardProps {
  agreement: DataSharingAgreement;
  compact?: boolean;  // For list views
}

// Compact view shows:
// - Name + category badge
// - Provider → Consumer
// - Status badge + effective date
// - View link

// Full view adds:
// - Description
// - Data elements list
// - Legal basis
// - Related services count
```

### 9.2 List Page Layout

```
┌────────────────────────────────────────────────────────────┐
│  Data Sharing Agreements                                   │
│  ────────────────────────                                  │
│  [Active: 5] [Under Review: 2] [Expired: 1]               │
│                                                            │
│  ┌── Filter by status ──┐  ┌── Filter by category ──┐     │
│                                                            │
│  Revenue and Taxation Service (RTS)                        │
│  ├─ [Card] Income Verification Agreement (DCS→RTS)         │
│  └─ [Card] Employment Status Agreement (DCS→RTS)           │
│                                                            │
│  Biometric Identity Agency (BIA)                           │
│  ├─ [Card] Identity Verification (DCS→BIA)                 │
│  └─ [Card] Licence Identity Checks (VLA→BIA)               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 9.3 Detail Page Layout

```
┌────────────────────────────────────────────────────────────┐
│  Home > Data Sharing Agreements > Income Verification      │
│                                                            │
│  [income] [active]                                         │
│  Income Verification Agreement                              │
│  ════════════════════════════                              │
│                                                            │
│  ┌─────────────────────────────┐  ┌─────────────────────┐ │
│  │ Main Content (2/3)          │  │ Sidebar (1/3)       │ │
│  │                             │  │                     │ │
│  │ Description                 │  │ Parties             │ │
│  │ Lorem ipsum dolor sit...    │  │ Provider: RTS       │ │
│  │                             │  │ Consumer: DCS       │ │
│  │ Data Elements               │  │                     │ │
│  │ • national-insurance-number │  │ Quick Info          │ │
│  │ • income-bands              │  │ Reference: DSA-2024 │ │
│  │ • employment-status         │  │ Effective: Jan 2024 │ │
│  │                             │  │ Review: Jan 2025    │ │
│  │ Legal Basis                 │  │                     │ │
│  │ GDPR Article 6(1)(e)        │  │ Category            │ │
│  │                             │  │ [income]            │ │
│  │ Related Services            │  │                     │ │
│  │ [Card] income-verify-api    │  │                     │ │
│  │ [Card] eligibility-engine   │  │                     │ │
│  │                             │  │                     │ │
│  │ Related Policies            │  │                     │ │
│  │ [Card] Data Sharing Policy  │  │                     │ │
│  └─────────────────────────────┘  └─────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## 10. Navigation Updates

### 10.1 Main Navigation

Add "Data Sharing" to header navigation (follow existing pattern):

```typescript
// In layout or nav component
{ href: '/data-sharing-agreements', label: 'Data Sharing' }
```

### 10.2 Homepage Stats

Add agreements count to stats panel:

```typescript
// Add to homepage stats grid
{ label: 'Data Sharing Agreements', count: dataSharingAgreements.length, href: '/data-sharing-agreements' }
```

## 11. Query Engine Integration

### 11.1 New Intents

Add to `agent-query.ts`:

```typescript
// Pattern matching
{ pattern: /\b(data|sharing)\b.*\b(agreement|accord)\b/i, intent: 'find_dsa' }
{ pattern: /\bwhat\b.*\b(share|sharing)\b.*with\b/i, intent: 'find_dsa_party' }
{ pattern: /\b(dsa|agreement)\b.*\b(expir|review)/i, intent: 'find_dsa_expiring' }
{ pattern: /\bwhich\b.*\b(service|implement)\b.*\b(dsa|agreement)\b/i, intent: 'find_dsa_services' }
```

### 11.2 Query Examples

| Query | Intent | Response |
|-------|--------|----------|
| "What data do we share with RTS?" | `find_dsa_party` | List agreements where RTS is provider or consumer |
| "Show agreements involving income data" | `find_dsa` | Filter by category='income' or dataElements contains 'income' |
| "Which services implement DSA-2024-0456?" | `find_dsa_services` | Find agreement by reference, return relatedServices |

## 12. Implementation Files Summary

| File | Action | Description |
|------|--------|-------------|
| `data-source/schema.ts` | Modify | Add types and interface |
| `data-source/data-sharing-agreements.ts` | Create | Demo data |
| `data-source/index.ts` | Modify | Export + helpers |
| `data-source/relationships/index.ts` | Modify | Add DSA relationships |
| `lib/data.ts` | Modify | Re-export for client |
| `lib/agent-query.ts` | Modify | Add query intents |
| `components/cards/DataSharingAgreementCard.tsx` | Create | Card component |
| `app/data-sharing-agreements/page.tsx` | Create | List page |
| `app/data-sharing-agreements/[id]/page.tsx` | Create | Detail page |
| `app/layout.tsx` or nav component | Modify | Add navigation |
| `app/page.tsx` | Modify | Add to stats panel |
| `app/departments/[id]/page.tsx` | Modify | Add "Agreements" section |

## 13. Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Graph node shape for DSAs? | **Decided** | Star shape for DSA nodes |
| Should DSAs appear in department pages? | **Decided** | Yes - add "Agreements" section to department detail pages |
| Multi-consumer agreements? | Decided | Keep single consumer for simplicity; can create multiple agreements if needed. |

## 14. Accessibility Considerations

Following WCAG 2.1 AA (per project rules):

- All interactive elements keyboard accessible
- Status badges have text labels (not color-only)
- Proper heading hierarchy (h1 → h2 → h3)
- Form filters have visible labels
- Focus indicators visible on all interactive elements
- Screen reader announcements for filter changes

## 15. Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Existing department data | Data | DSAs reference department IDs |
| Existing service data | Data | DSAs reference service IDs |
| Existing policy data | Data | DSAs reference policy IDs |
| GOV.UK Design System | UI | Following existing patterns |

---

## Status

**Design Status:** Complete - Ready for review

**Next Step:** After approval, run `/pdd-implement` to create implementation plan
