# ADR-006: Agent Marketplace Trust Architecture

## Status

**Proposed**

## Context

Wayfinder enables discovery of services, policies, agents, and data sharing agreements across government departments. As the platform matures from a knowledge graph into an operational tool, a new requirement emerges: **a trusted marketplace for sharing, forking, and composing agents and MCP servers across departmental boundaries**.

### The Trust Problem

Currently, Wayfinder's Agent entity (ADR-003) models agents as data records with ownership, capabilities, and permissions. However, the data model assumes trust is established out of band. When a colleague browses the graph and discovers an agent close to their needs, two scenarios create trust gaps:

1. **Fork and modify**: A user forks an existing agent, modifies its capabilities, and publishes the variant. How do other departments verify the fork hasn't introduced malicious behaviour or weakened guardrails?

2. **Feature request to originator**: A user asks the original author to add capabilities, producing a new version. How does the marketplace prove this version is legitimately from the original author and hasn't been tampered with in transit or at rest?

Both scenarios require **provenance, integrity, and graduated trust** - concepts not currently modelled in Wayfinder.

### Why This Matters for Government

Government agent marketplaces face unique constraints:
- **No single root of trust**: No one department should control the trust infrastructure
- **Sovereign data**: Each department must control its own agents and attestations
- **Audit requirements**: NCSC Principle 13 mandates logging of security-relevant events
- **Supply chain security**: NCSC Principle 8 requires verified provenance of software components
- **Cross-boundary operation**: Agents frequently operate across departmental boundaries (see DSA relationships in ADR-004)

### Prior Art

This proposal builds on cryptographic trust design explored in the Nautlab project (006-prime_directive_crypto_design.md), which established patterns for:
- Birth certificate chains for digital entities
- Immutable behavioural constraints (guardrails as physics, not policy)
- Runtime verification of entity integrity
- Network-level rejection of tampered entities

### Current Wayfinder Maturity

Wayfinder's existing architecture provides genuine foundations for this work:
- **Solid Pod integration**: Real `@inrupt/solid-client` with WebID resolution - provides decentralised identity
- **Agent schema**: `clonedFrom`, `webId`, `sourceRepository`, `version` fields already model lineage
- **Audit entries**: `AgentAuditEntry` with `inputHash`/`outputHash` already captures cryptographic evidence
- **Access control**: RBAC + ABAC with audit logging (implemented, not just types)
- **Graph relationships**: `delegates-to`, `owned-by` already model agent trust chains

What's missing: cryptographic signing, a shared verification ledger, and fork-aware provenance tracking.

## Decision

We will implement a **federated agent trust architecture** using three complementary layers:

### Layer 1: Agent Trust Manifests (Content Integrity)

Every agent published to the marketplace must have a signed manifest that separates the agent's functional definition from its behavioural constraints:

```typescript
interface AgentTrustManifest {
  // Content integrity
  manifestVersion: '1.0';
  agentId: string;
  contentHash: string;             // SHA-256 of agent code/config/prompts
  guardrailsHash: string;          // Separate SHA-256 of behavioural constraints
  capabilitiesHash: string;        // SHA-256 of declared capabilities

  // Lineage
  lineage: AgentLineage;

  // Attestation chain (ordered, each signs the previous)
  attestations: AgentAttestation[];

  // Ledger reference (populated after consensus)
  ledgerRef?: LedgerReference;
}

interface AgentLineage {
  type: 'original' | 'fork' | 'version-update';

  // For forks
  forkedFrom?: {
    agentId: string;
    contentHash: string;           // Hash at time of fork
    manifestUrl: string;           // Where to verify the parent
    diffHash: string;              // Hash of what changed
    guardrailsModified: boolean;   // Critical flag - triggers review
  };

  // For version updates
  previousVersion?: {
    agentId: string;
    contentHash: string;
    version: string;
  };
}

interface AgentAttestation {
  type:
    | 'author'                       // Creator vouches for the agent
    | 'team'                         // Owning team has reviewed
    | 'department'                   // Department security approval
    | 'security-review'              // NCSC or equivalent review
    | 'original-author-fork-approval' // Original author approves a fork
    | 'cross-dept-verification';     // Another department has verified

  attestorWebId: string;           // Solid WebID of the signer
  signature: string;               // Ed25519 signature over manifest
  timestamp: string;               // ISO 8601
  statement: string;               // Human-readable attestation
  expiresAt?: string;              // Attestations can expire
}

interface LedgerReference {
  blockHash: string;
  transactionId: string;
  consensusTimestamp: string;
  nodeCount: number;               // How many nodes validated
}
```

**Key design choice**: The `guardrailsHash` is separate from `contentHash`. This means the marketplace can instantly answer: "Did this fork change the safety constraints, or just the functionality?" A changed guardrails hash triggers mandatory security review.

### Layer 2: Solid Pod Infrastructure (Sovereign Storage)

Each department operates three Solid Pods as the sovereign storage layer:

| Pod | Purpose | Contents |
|-----|---------|----------|
| **Agent Registry Pod** | Stores agent manifests and artifacts | `/agents/{id}/manifest.jsonld`, `/agents/{id}/artifact.tar.gz`, `/agents/{id}/attestations/` |
| **Operational Pod** | Runtime telemetry and access control | Usage logs, access policies, rate limits, department-scoped configurations |
| **Audit Pod** | Immutable compliance records | Attestation history, verification events, security review outcomes, DPIA records |

Solid Pods provide:
- **WebID-based identity**: Every author, team, and department has a verifiable WebID rooted in their own infrastructure
- **Access control**: Solid's WAC (Web Access Control) determines who can read/write agent manifests
- **Linked Data**: Agent manifests use JSON-LD, enabling cross-pod queries and federation
- **Sovereignty**: Each department controls its own data - no centralised dependency

The Solid WebID acts as the **certificate authority** - the department's Pod server IS the identity provider. No external CA infrastructure is needed.

### Layer 3: Private Blockchain Ledger (Consensus and Immutability)

A permissioned blockchain where each department runs a node provides the trust consensus layer. The blockchain does **not** store agent artifacts - it stores the **trust graph**:

#### Ledger Events

```
PUBLISH     Agent published with manifest hash and attestation chain
FORK        New agent created from existing agent, with lineage link
UPDATE      New version of existing agent, with version chain
ATTEST      New attestation added to an existing agent
REVOKE      Agent marked as compromised or deprecated
VERIFY      Department confirms local copy matches ledger hash
DISPUTE     Department flags an agent as potentially compromised
```

#### Consensus Model

- **Type**: Permissioned (Hyperledger Fabric or similar), not proof-of-work
- **Nodes**: One per participating department (5-10 initially)
- **Consensus**: Practical Byzantine Fault Tolerance (PBFT) - tolerates up to f = (n-1)/3 compromised nodes
- **Block contents**: Event records with manifest hashes, not agent artifacts
- **Query**: Any department can query the full trust history of any agent

#### What the Blockchain Prevents

| Attack | Without Blockchain | With Blockchain |
|--------|-------------------|-----------------|
| Compromised Pod admin modifies agent | Undetected until manually checked | Detected: local hash diverges from ledger |
| Insider publishes backdoored agent | Other departments trust based on source | Attestation chain shows exactly who vouched |
| Fork removes safety guardrails | Not visible | `guardrailsModified: true` flag triggers review |
| Rollback attack (publish safe version, then swap) | Possible | Ledger records original hash permanently |
| Disputed provenance ("I didn't publish that") | No evidence | Cryptographic signature on ledger |

### Trust Levels

The marketplace displays graduated trust based on attestation depth:

| Level | Attestations Required | Graph Visualisation | Marketplace Label |
|-------|----------------------|--------------------|--------------------|
| `self-signed` | Author only | Red border | "Author-signed only" |
| `team-attested` | Author + Team | Amber border | "Team reviewed" |
| `dept-attested` | Author + Team + Department | Green border | "Department approved" |
| `security-reviewed` | + Security review | Green + shield icon | "Security reviewed" |
| `cross-dept-verified` | + Other department(s) verified | Gold border | "Cross-department verified" |
| `author-verified-fork` | Fork + original author approval | Green + fork icon | "Approved fork" |
| `unverified-fork` | Fork without original author | Amber + fork icon | "Unverified fork" |

### Verification Flows

#### Publishing a New Agent

```
1. Author creates agent and signs manifest with their WebID key
2. Team reviews and adds team attestation
3. Department security review adds department attestation
4. Department node submits PUBLISH event to blockchain
5. Other department nodes validate the attestation chain
6. Consensus reached → agent is trusted in marketplace
7. Manifest stored in department's Agent Registry Pod
8. Graph updated with trust level visualisation
```

#### Forking an Agent

```
1. User forks agent from marketplace
2. System records: parent agent ID, parent content hash, fork timestamp
3. User modifies agent
4. System computes: new content hash, diff hash, guardrails comparison
5. If guardrailsModified == true → mandatory security review required
6. User's attestation chain (author → team → dept) applied to fork
7. FORK event submitted to blockchain with full lineage
8. Original author notified via their Solid Pod
9. Original author can optionally add 'original-author-fork-approval' attestation
10. Trust level reflects attestation depth
```

#### Periodic Verification

```
1. Each department runs scheduled VERIFY jobs
2. For each agent deployed locally:
   a. Compute current content hash
   b. Query blockchain for recorded hash
   c. If mismatch → DISPUTE event + alert
3. VERIFY events recorded on blockchain
4. Dashboard shows verification status across all departments
```

## Consequences

### Positive

- **No single point of compromise**: Federated trust means no one department controls the truth
- **Fork-aware provenance**: Complete lineage tracking from original through all derivatives
- **Guardrail integrity**: Separate hashing of behavioural constraints detects safety modifications
- **NCSC compliance**: Meets Principle 8 (supply chain), Principle 13 (audit), Principle 7 (secure development)
- **Solid alignment**: Builds on existing WebID identity and Pod infrastructure rather than introducing new systems
- **Graduated trust**: Users can make informed decisions based on attestation depth
- **Existing schema compatibility**: Extends rather than replaces the current Agent interface

### Negative

- **Operational complexity**: Each department must run a blockchain node and maintain Pod infrastructure
- **Key management burden**: Department signing keys require secure storage and rotation procedures
- **Consensus latency**: Publishing/forking requires multi-node consensus (seconds, not milliseconds)
- **Adoption barrier**: Requires all participating departments to deploy infrastructure
- **Over-engineering risk**: For a small number of departments (5-10), a simpler signed-manifest registry with mutual verification may suffice

### Neutral

- **Blockchain vs. simpler alternatives**: With only 5-10 department nodes, a distributed signed ledger (without full blockchain machinery) could achieve similar guarantees. The architecture is designed to work with either approach - the trust manifest and attestation chain are the core innovation, the consensus layer is pluggable
- **Not an execution framework**: This ADR addresses trust and provenance of agent definitions, not runtime orchestration of agent actions (which remains a separate concern)
- **Incremental adoption**: Departments can participate at different levels - even without blockchain, signed manifests in Solid Pods provide significant trust improvement over the current model

## Implementation Plan

### Phase 1: Trust Manifests (Foundation)

Extend the existing Agent schema with manifest fields:
- Add `AgentTrustManifest` interface to schema
- Implement content hashing for agent artifacts
- Separate guardrails hashing
- Store manifests in existing Solid Pod structure
- Display trust level in agent detail pages and graph

Key files:
- `app/src/data-source/schema.ts` - Add manifest types
- `app/src/components/graph/GraphCanvas.tsx` - Trust level visualisation
- `app/src/lib/access-control/` - Manifest verification logic

### Phase 2: Attestation Chain

Implement multi-party signing:
- WebID-based signing using Solid Pod keys
- Team and department attestation workflows
- Attestation verification on agent load
- Fork detection and lineage tracking

### Phase 3: Distributed Ledger

Deploy consensus infrastructure:
- Evaluate Hyperledger Fabric vs. lighter alternatives
- Deploy nodes per participating department
- Implement PUBLISH/FORK/VERIFY/REVOKE events
- Dashboard for cross-department trust status

### Phase 4: Marketplace UX

Build the discovery and trust UI:
- Trust-aware search and filtering
- Fork lineage visualisation in graph
- Attestation chain viewer
- Verification status dashboard
- Notification system for fork events

## Alternatives Considered

### Alternative 1: Centralised Registry with Code Signing

A single government-run registry (like npm) where agents are signed by authors and verified by a central authority.

**Rejected because**: Single point of failure and compromise. Contradicts sovereignty requirements. One department controlling trust for all others is politically and architecturally unacceptable.

### Alternative 2: Git-based Provenance (Sigstore/cosign model)

Use signed Git commits with transparency logs, similar to container image signing.

**Partially adopted**: The content hashing and signing concepts from Sigstore inform Phase 1. However, Git-based provenance alone doesn't provide multi-party attestation or cross-department consensus.

### Alternative 3: W3C Verifiable Credentials

Use Verifiable Credentials for attestations instead of blockchain.

**Remains viable**: VCs could replace the blockchain layer for attestation recording while keeping Solid Pods as the storage layer. This is noted as a lighter-weight alternative in Phase 3 evaluation. The manifest and attestation chain design works with either backend.

## Related Documents

- [ADR-003: Agent Architecture](./ADR-003-agent-architecture.md) - Agent identity and governance model
- [ADR-004: Data Sharing Agreements](./ADR-004-data-sharing-agreements.md) - Cross-department data governance
- [ADR-005: AI Chat Security Controls](./ADR-005-ai-chat-security-controls.md) - Security controls for query interface
- [Nautlab Prime Directive Crypto Design](../../../nautlab/nautlab-docs/006-prime_directive_crypto_design.md) - Prior art on cryptographic trust for digital entities
- [NCSC Cloud Security Principles](../../.claude/rules/ncsc-compliance.md) - Principles 7, 8, 13

## References

- [NCSC Supply Chain Security Guidance](https://www.ncsc.gov.uk/collection/supply-chain-security)
- [SLSA Framework (Supply-chain Levels for Software Artifacts)](https://slsa.dev/)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [Solid WebID Authentication](https://solidproject.org/TR/protocol)
- [Sigstore - Software Supply Chain Security](https://www.sigstore.dev/)
- [NIST SSDF (Secure Software Development Framework)](https://csrc.nist.gov/Projects/ssdf)
