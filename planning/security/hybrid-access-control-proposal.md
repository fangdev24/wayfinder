# Hybrid Access Control Proposal: RBAC + ABAC with DSA Enforcement

> **Status**: Draft for Discussion
> **Audience**: RSC-Hub Review
> **Date**: January 2026

---

## 1. Executive Summary

This proposal outlines a **hybrid access control model** combining:
- **RBAC** (Role-Based Access Control) for user categorisation
- **ABAC** (Attribute-Based Access Control) for contextual, DSA-driven permissions

This approach ensures that data access in Wayfinder respects **Data Sharing Agreements** as the legal foundation for cross-government data exchange.

---

## 2. The Problem

### Current Gap
Wayfinder shows *what data flows between departments*, but doesn't enforce *who can see that information based on their authority*.

### Legal Context
- GDPR Article 6: Requires lawful basis for data processing
- Digital Economy Act 2017: Enables specific cross-government data sharing
- Data Protection Act 2018: UK implementation of GDPR

**Key Principle**: Staff should only see data sharing information relevant to their department and active agreements.

---

## 3. Proposed Model

### 3.1 Two-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ACCESS REQUEST                           │
│            "Can Alice view NHS→HMRC DSA details?"               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: RBAC                                │
│                 "What type of user is Alice?"                   │
├─────────────────────────────────────────────────────────────────┤
│  ✓ Alice has role: department-analyst                          │
│  ✓ Role grants: read access to DSAs involving her department   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 2: ABAC                                │
│          "Does THIS resource match Alice's attributes?"         │
├─────────────────────────────────────────────────────────────────┤
│  Subject Attributes:                                            │
│    • department = "HMRC"                                        │
│    • clearance = "OFFICIAL-SENSITIVE"                           │
│                                                                 │
│  Resource Attributes (DSA):                                     │
│    • provider = "NHS"                                           │
│    • consumer = "HMRC"  ← matches Alice's department ✓          │
│    • status = "ACTIVE" ✓                                        │
│    • validUntil = "2027-12-31" ✓ (not expired)                 │
│                                                                 │
│  RESULT: ALLOW                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Role Definitions (RBAC Layer)

| Role | Description | Base Permissions |
|------|-------------|------------------|
| `public-viewer` | Unauthenticated or basic access | View public service catalogue only |
| `department-member` | Staff within a department | View own department's services, teams, and relevant DSAs |
| `department-analyst` | Data/policy analyst | Above + query cross-department flows where own dept is party |
| `cross-gov-analyst` | Central function (e.g., Cabinet Office) | View all DSAs and data flows |
| `platform-admin` | Technical administrator | System configuration, no data access |

### 3.3 Attribute Policies (ABAC Layer)

#### Policy 1: DSA Visibility

```yaml
policy: dsa-visibility
description: Users can only view DSAs where their department is involved
effect: ALLOW
actions: [read, query]
resource: dsa:*
conditions:
  - user.department IN [resource.providerDepartment, resource.consumerDepartment]
  - resource.status = "ACTIVE"
  - environment.currentDate BETWEEN resource.startDate AND resource.endDate
```

#### Policy 2: Data Element Access

```yaml
policy: data-element-visibility
description: Specific data elements visible only to parties with legal basis
effect: ALLOW
actions: [read]
resource: dsa:*/dataElements
conditions:
  - user.department IN [resource.providerDepartment, resource.consumerDepartment]
  - user.hasTraining CONTAINS "data-protection-awareness"
```

#### Policy 3: Service Architecture (Less Sensitive)

```yaml
policy: service-architecture-visibility
description: Service information visible to authenticated government users
effect: ALLOW
actions: [read, query]
resource: service:*
conditions:
  - user.role != "public-viewer"
  - resource.classification IN ["PUBLIC", "OFFICIAL"]
```

#### Policy 4: Cross-Government Override

```yaml
policy: cross-gov-access
description: Central analysts can view all for oversight purposes
effect: ALLOW
actions: [read, query]
resource: [dsa:*, service:*, dataflow:*]
conditions:
  - user.role = "cross-gov-analyst"
  - user.department IN ["Cabinet Office", "CDDO", "GDS"]
```

---

## 4. DSA Integration

### 4.1 DSA as the Source of Truth

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA SHARING AGREEMENT                    │
├──────────────────────────────────────────────────────────────┤
│  ID:              DSA-2024-NHS-HMRC-001                      │
│  Title:           Patient Tax Status Verification            │
│                                                              │
│  ┌─────────────┐         ┌─────────────┐                    │
│  │    NHS      │ ──────► │    HMRC     │                    │
│  │  (Provider) │  Data   │  (Consumer) │                    │
│  └─────────────┘         └─────────────┘                    │
│                                                              │
│  Legal Basis:     Digital Economy Act 2017, s.35            │
│  Purpose:         Verify patient exemption eligibility       │
│                                                              │
│  Data Elements:                                              │
│    • NHS Number (identifier)                                 │
│    • Exemption Status (category)                             │
│    • Valid From Date (date)                                  │
│                                                              │
│  Validity:        2024-04-01 to 2027-03-31                  │
│  Status:          ACTIVE                                     │
│  Classification:  OFFICIAL-SENSITIVE                         │
│                                                              │
│  Review Date:     2026-04-01                                │
│  Data Controller: NHS England                                │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Access Scenarios

| User | Department | Query | Result |
|------|------------|-------|--------|
| Alice | HMRC | "Show DSAs where we receive data" | ✅ Sees NHS→HMRC DSA |
| Alice | HMRC | "Show DSAs between NHS and DWP" | ❌ Denied (not a party) |
| Bob | NHS | "Show DSAs where we provide data" | ✅ Sees NHS→HMRC DSA |
| Carol | Cabinet Office | "Show all active DSAs" | ✅ Sees all (cross-gov role) |
| Dave | Public | "Show DSAs" | ❌ Denied (no role) |

### 4.3 Time-Based Enforcement

```
Timeline for DSA-2024-NHS-HMRC-001:

2024-04-01                    2026-04-01                    2027-03-31
    │                             │                             │
    ▼                             ▼                             ▼
    ├─────────────────────────────┼─────────────────────────────┤
    │         ACTIVE              │         ACTIVE              │
    │                             │                             │
    │                        Review Due                    Expires
    │                        (Alert sent)              (Access revoked)
    │
  Start Date
  (Access begins)
```

---

## 5. Implementation Approach

### 5.1 Technical Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      WAYFINDER APPLICATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Query     │───►│   Policy    │───►│   Data      │        │
│  │   Engine    │    │   Engine    │    │   Layer     │        │
│  └─────────────┘    └─────────────┘    └─────────────┘        │
│         │                  │                  │                 │
│         │           ┌──────┴──────┐          │                 │
│         │           │             │          │                 │
│         │     ┌─────┴────┐  ┌────┴─────┐    │                 │
│         │     │   RBAC   │  │   ABAC   │    │                 │
│         │     │  (Roles) │  │(Policies)│    │                 │
│         │     └──────────┘  └──────────┘    │                 │
│         │                                    │                 │
│         ▼                                    ▼                 │
│  ┌─────────────┐                     ┌─────────────┐          │
│  │   Audit     │                     │    DSA      │          │
│  │    Log      │                     │   Store     │          │
│  └─────────────┘                     └─────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Policy Engine Options

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Custom (TypeScript)** | Build policy evaluation in-app | Full control, no dependencies | Maintenance burden |
| **Open Policy Agent (OPA)** | Industry standard policy engine | Battle-tested, declarative Rego language | Additional infrastructure |
| **Casbin** | Lightweight policy library | Easy integration, multiple models | Less expressive than OPA |
| **AWS Verified Permissions** | Managed service (Cedar language) | Managed, scalable | Cloud lock-in, cost |

**Recommendation**: Start with **Casbin** for simplicity, migrate to **OPA** if policy complexity grows.

### 5.3 Phased Rollout

```
Phase 1 (MVP)                 Phase 2                      Phase 3
─────────────────────────────────────────────────────────────────────
│                             │                            │
│  • Basic RBAC roles         │  • ABAC policies           │  • Full DSA enforcement
│  • Department membership    │  • DSA time validation     │  • Data element filtering
│  • Authentication           │  • Cross-dept rules        │  • Audit reporting
│                             │                            │
└─────────────────────────────┴────────────────────────────┴─────────
      Foundation                  Policy Engine               Full Compliance
```

---

## 6. Audit & Compliance

### 6.1 What Gets Logged

Every access decision produces an audit record:

```json
{
  "timestamp": "2026-01-16T14:32:01Z",
  "requestId": "req-abc123",
  "subject": {
    "userId": "alice.smith@hmrc.gov.uk",
    "department": "HMRC",
    "roles": ["department-analyst"]
  },
  "action": "read",
  "resource": {
    "type": "dsa",
    "id": "DSA-2024-NHS-HMRC-001"
  },
  "decision": "ALLOW",
  "policiesEvaluated": [
    { "policy": "dsa-visibility", "result": "ALLOW" }
  ],
  "context": {
    "ipAddress": "10.0.0.50",
    "userAgent": "Wayfinder-Web/1.0"
  }
}
```

### 6.2 Compliance Reporting

| Report | Frequency | Audience |
|--------|-----------|----------|
| Access Summary | Weekly | Data Protection Officer |
| Policy Violations | Real-time alert | Security Team |
| DSA Expiry Warnings | 30 days before | DSA Owners |
| Cross-Department Access | Monthly | Governance Board |

---

## 7. Discussion Points for RSC-Hub

### 7.1 Questions to Resolve

1. **Role Granularity**: Are the five proposed roles sufficient, or do we need sub-department roles?

2. **Cross-Gov Access**: Should Cabinet Office/CDDO have blanket access, or should it be DSA-by-DSA?

3. **Expired DSA Handling**: When a DSA expires:
   - Option A: Immediately revoke all access
   - Option B: Grace period (30 days) for renewal
   - Option C: Read-only access to historical records

4. **Training Requirements**: Should data protection training be a prerequisite for DSA access?

5. **Delegation**: Can department heads delegate access to contractors/consultants?

### 7.2 Trade-offs to Consider

| Decision | Option A | Option B |
|----------|----------|----------|
| **Default stance** | Deny unless explicitly allowed (more secure) | Allow for authenticated users, restrict sensitive (more usable) |
| **Policy location** | Embedded in code (simpler) | External policy engine (more flexible) |
| **DSA sync** | Manual updates | Auto-sync from central DSA register |
| **Audit retention** | 1 year (cheaper) | 7 years (full compliance) |

### 7.3 Dependencies

- **Identity Provider**: Need department attribute in user claims (Azure AD / GOV.UK One Login)
- **DSA Register**: Source of truth for agreement status and validity
- **Training Records**: To enforce training prerequisites

---

## 8. Next Steps

If approved:

1. **ADR Update**: Amend ADR-005 to specify hybrid RBAC+ABAC approach
2. **Prototype**: Build policy engine with Casbin for 2-3 sample DSAs
3. **User Research**: Validate role definitions with actual department users
4. **Integration Planning**: Identify identity provider and DSA register connections

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **RBAC** | Role-Based Access Control - permissions assigned to roles, roles assigned to users |
| **ABAC** | Attribute-Based Access Control - permissions evaluated against user/resource/environment attributes |
| **DSA** | Data Sharing Agreement - legal agreement authorising data exchange between departments |
| **Policy Engine** | Component that evaluates access requests against defined rules |
| **Subject** | The user or system requesting access |
| **Resource** | The data or function being accessed |

## Appendix B: Example Rego Policy (OPA)

```rego
# policy/dsa_access.rego

package wayfinder.dsa

default allow = false

# Allow if user's department is party to the DSA
allow {
    input.action == "read"
    dsa := data.dsas[input.resource.id]
    dsa.status == "ACTIVE"
    user_is_party(input.subject.department, dsa)
    dsa_is_valid(dsa)
}

user_is_party(dept, dsa) {
    dept == dsa.providerDepartment
}

user_is_party(dept, dsa) {
    dept == dsa.consumerDepartment
}

dsa_is_valid(dsa) {
    time.now_ns() >= time.parse_rfc3339_ns(dsa.startDate)
    time.now_ns() <= time.parse_rfc3339_ns(dsa.endDate)
}
```

---

*Document prepared for RSC-Hub discussion - January 2026*
