# How the Knowledge Graph Works: Behind the Scenes

> A companion explainer for the Wayfinder demo. Intended to be shared with stakeholders, technical colleagues, or anyone curious about the architecture.

---

## The Problem Knowledge Graphs Solve

Traditional databases store information in tables. You can ask "give me all services in Department X" easily enough. But the harder questions -- *"if the Identity Verification API goes down, which citizen-facing services across which departments are affected?"* -- require joining across many tables, and the query complexity grows with every hop.

A knowledge graph flips this. Instead of tables, you have **entities** and **relationships**. The connections between things are first-class data, not afterthoughts buried in foreign keys. This makes it natural to traverse chains of dependency, ownership, and governance that span organisational boundaries.

---

## Layer 1: The Ontology (What Exists)

An ontology defines the **types of things** in your domain and the **types of relationships** between them. Think of it as the grammar of your knowledge graph -- before you add any data, you define what kinds of sentences are possible.

Wayfinder's ontology has seven entity types:

| Entity | What It Represents | Example |
|---|---|---|
| **Department** | A government department | Dept of Citizen Support (DCS) |
| **Team** | A delivery team within a department | Puffin Delivery Team |
| **Service** | An API, platform, or shared capability | Eligibility API |
| **Pattern** | A proven approach to a common problem | Circuit Breaker, Consent Management |
| **Policy** | A cross-government mandate or framework | Digital Identity Programme |
| **Agent** | An autonomous AI/automation actor | Deploy Bot, Policy Enforcer |
| **Data Sharing Agreement** | A formal legal basis for cross-dept data flows | DCS-RTS Income Verification DSA |

Each entity type has a defined shape -- a Department has an acronym and a colour; a Service has an endpoint, authentication methods, and uptime; an Agent has capabilities, permissions, and an audit trail. This schema is the ontology in code.

### Why the Ontology Matters

Without it, a graph is just dots and lines. The ontology gives those dots and lines **meaning**. When you see a node on the graph, you know it is a Service or a Team or a Policy -- and you know what properties it has, what questions you can ask of it, and what kinds of connections it can form.

---

## Layer 2: The Semantic Layer (How Things Relate)

Relationships in a knowledge graph are not just links -- they carry **semantic meaning**. Each relationship has a type that tells you *why* two things are connected.

Wayfinder uses 15 relationship types:

| Relationship | Connects | Meaning |
|---|---|---|
| `belongs-to` | Team to Department | Organisational hierarchy |
| `maintains` | Team to Service | Ownership and accountability |
| `consumes` | Service to Service | Runtime dependency |
| `implements` | Service to Pattern | Architectural decisions |
| `contributed-to` | Team to Pattern | Knowledge sharing |
| `governs` | Policy to Service/Dept | Regulatory oversight |
| `requires` | Policy to Policy | Policy dependencies |
| `owned-by` | Agent to Team | Agent accountability |
| `governed-by` | Agent to Policy | Agent compliance |
| `delegates-to` | Agent to Agent | Agent chains of trust |
| `data-provider` | DSA to Service | Who supplies data |
| `data-consumer` | DSA to Service | Who receives data |
| `complies-with` | DSA to Policy | Legal basis |
| `reports-to` | Agent to Team | Oversight relationship |
| `related-to` | Any to Any | Looser conceptual links |

### The Power of Typed Relationships

This is where knowledge graphs become more than a pretty diagram. Consider the relationship `consumes`. When the Eligibility API (in Citizen Support) consumes the Income Verification API (in Revenue & Tax), that single edge encodes:

- **A runtime dependency**: if Income Verification goes down, Eligibility is affected
- **A cross-departmental boundary**: two different departments are coupled
- **A data flow**: citizen income data is crossing an organisational boundary
- **A governance requirement**: this data flow needs a Data Sharing Agreement and legal basis

A traditional database might store "eligibility-api depends on income-verification-api" as a row. A knowledge graph lets you *traverse* from that dependency to the teams who own each service, the Data Sharing Agreement that governs the data flow, the policy that mandates the legal basis, and the patterns both services implement -- all through the same connected structure.

---

## Layer 3: Entity Interactions (Traversal in Practice)

The real value of a knowledge graph emerges when you traverse it. Here are examples of multi-hop queries that would be painful with traditional databases but are natural in a graph:

### Impact Analysis
> "If the Identity Verification API goes down, who is affected?"

Traverse: Identity Verification API **<-- consumes --** (Citizen Portal, Licence Application API, Integration Hub) **-- maintains -->** (Wolf Identity Team, Puffin Delivery Team, ...) **-- belongs-to -->** (BIA, DCS, VLA)

Three hops and you have a cross-government impact assessment.

### Governance Tracing
> "What is the legal basis for DCS using income data from RTS?"

Traverse: Eligibility API **<-- data-consumer --** DSA-DCS-RTS-Income **-- complies-with -->** (Data Sharing Framework, Welfare Data Reform) **-- data-provider -->** Income Verification API

You can trace from the consuming service, through the formal agreement, to the policies and the providing service -- a complete audit chain.

### Pattern Discovery
> "Which teams have experience with consent management?"

Traverse: Consent Management Pattern **<-- contributed-to --** (Tern Integration, Kestrel API, Oak Records) **-- belongs-to -->** (DCS, RTS, NHDS)

Three departments have implemented this pattern. Now you know who to talk to.

---

## The Decentralised Identity Layer

There is one more architectural decision worth highlighting. People and team profile data in Wayfinder does not live in a central database. It is fetched from **Solid Pods** -- personal data stores based on the W3C Solid specification.

Each person has a WebID (a URI that identifies them) and a Pod (where their profile, skills, and team membership are stored). When you click on a maintainer in Wayfinder, the application fetches their profile from their Pod in real time.

This means:
- **Each department controls their own identity data** -- no central HR database to synchronise
- **People own their profiles** -- data sovereignty is built into the architecture, not bolted on
- **The graph links to identity, it does not store it** -- the `webId` field on a Person is a pointer, not a copy

This is a practical demonstration of the Solid principle: your data lives where you control it, and applications request access rather than hoarding copies.

---

## How It Comes Together

When you look at the Wayfinder graph visualisation, every node you see is a typed entity from the ontology. Every line between nodes is a semantic relationship. The colours encode departments. The layout uses force-directed simulation (D3.js) so that tightly-connected clusters naturally group together and cross-departmental links stretch visibly between them.

The natural language query interface ("Who maintains the Identity Verification API?") works by parsing your question, identifying which entities and relationships are relevant, traversing the graph, and composing an answer from the connected data.

The graph currently contains:
- **6** Departments
- **23** Teams
- **85** Services and APIs
- **19** Patterns
- **5** Policies
- **5** AI Agents
- **6** Data Sharing Agreements
- **24** People (from Solid Pods)
- **230+** Relationships connecting them

All demo data is fictional, but the structure mirrors real cross-government complexity.

---

## Summary

| Concept | What It Does | Wayfinder Example |
|---|---|---|
| **Ontology** | Defines entity types and their properties | 7 entity types (Department, Team, Service, Pattern, Policy, Agent, DSA) |
| **Semantic Layer** | Gives relationships meaning beyond "is linked to" | 15 relationship types (consumes, governs, complies-with, etc.) |
| **Traversal** | Follows chains of relationships to answer complex questions | Impact analysis, governance tracing, pattern discovery |
| **Decentralised Identity** | Identity data stays with its owner | People fetched from Solid Pods, not a central database |

The knowledge graph is not just a visualisation tool. It is a **queryable model of how government digital services actually connect** -- across teams, departments, data flows, legal agreements, and architectural patterns. The graph structure makes those connections discoverable rather than hidden in spreadsheets and tribal knowledge.
