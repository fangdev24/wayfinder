import Link from 'next/link';

export const metadata = {
  title: 'Production Architecture - Wayfinder',
  description: 'How Wayfinder could work in production using federated Solid Pods',
};

export default function ArchitecturePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Production Vision</span>
          <h1 className="govuk-heading-xl">Federated Architecture</h1>
          <p className="govuk-body-l">
            How Wayfinder could work at scale with full departmental autonomy
            using a 3-Pod model per department.
          </p>
        </div>
      </div>

      {/* Demo vs Production */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Demo vs Production</h2>

          <h3 className="govuk-heading-m">Current demo architecture</h3>
          <p className="govuk-body">
            The demo uses a hybrid approach: service catalogue data lives in a SQLite
            database, while people profiles are fetched from Solid Pods. This demonstrates
            the concept while keeping the demo simple to run.
          </p>

          <div className="govuk-inset-text">
            <pre style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4', margin: 0, whiteSpace: 'pre' }}>
{`┌─────────────────────────────────────────────────┐
│              Wayfinder Demo                     │
├─────────────────────────────────────────────────┤
│                                                 │
│   ┌─────────────┐      ┌─────────────────────┐  │
│   │   SQLite    │      │   Solid Pod Server  │  │
│   │  Database   │      │   (localhost:3002)  │  │
│   ├─────────────┤      ├─────────────────────┤  │
│   │ • Services  │      │ • /river-stone/     │  │
│   │ • Teams     │      │ • /ash-morgan/      │  │
│   │ • Patterns  │      │ • /flint-rivers/    │  │
│   │ • Deps      │      │ • ...24 profiles    │  │
│   └─────────────┘      └─────────────────────┘  │
│         ▲                       ▲               │
│         │                       │               │
│         └───────┬───────────────┘               │
│                 │                               │
│          ┌──────▼──────┐                        │
│          │  Next.js    │                        │
│          │  Frontend   │                        │
│          └─────────────┘                        │
└─────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Production architecture</h3>
          <p className="govuk-body">
            In production, each department would operate their own Pod infrastructure.
            Wayfinder becomes a <strong>federated aggregator</strong> that queries across
            departments rather than a central database owner.
          </p>
        </div>
      </div>

      {/* 3-Pod Model */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">The 3-Pod Model</h2>
          <p className="govuk-body">
            Each department operates three distinct Pods with clear separation of concerns:
          </p>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderTop: '5px solid #1d70b8', minHeight: '280px' }}
          >
            <h3 className="govuk-heading-m" style={{ color: '#1d70b8' }}>Identity Pod</h3>
            <p className="govuk-body-s"><strong>Purpose:</strong> Who works here</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              <li>Team profiles and membership</li>
              <li>People profiles (name, role, skills)</li>
              <li>Organisational structure</li>
              <li>Contact information</li>
              <li>Authentication credentials</li>
            </ul>
            <p className="govuk-body-s govuk-!-margin-top-4">
              <strong>WebID owner:</strong> Department or Team
            </p>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderTop: '5px solid #912b88', minHeight: '280px' }}
          >
            <h3 className="govuk-heading-m" style={{ color: '#912b88' }}>Agent Pod</h3>
            <p className="govuk-body-s"><strong>Purpose:</strong> What can act autonomously</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              <li>AI agent identities</li>
              <li>Automation service accounts</li>
              <li>Agent capabilities and permissions</li>
              <li>Scoped credentials and tokens</li>
              <li>Audit logs of agent actions</li>
            </ul>
            <p className="govuk-body-s govuk-!-margin-top-4">
              <strong>WebID owner:</strong> Team (delegated to agents)
            </p>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4"
            style={{ background: '#f3f2f1', borderTop: '5px solid #00703c', minHeight: '280px' }}
          >
            <h3 className="govuk-heading-m" style={{ color: '#00703c' }}>Data Pod</h3>
            <p className="govuk-body-s"><strong>Purpose:</strong> What we offer</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              <li>Service definitions and metadata</li>
              <li>API documentation</li>
              <li>Architecture patterns</li>
              <li>Dependencies and relationships</li>
              <li>Integration specifications</li>
            </ul>
            <p className="govuk-body-s govuk-!-margin-top-4">
              <strong>WebID owner:</strong> Team
            </p>
          </div>
        </div>
      </div>

      {/* Full Architecture Diagram */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">Federated System Overview</h2>
          <div className="govuk-inset-text">
            <pre style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.4', margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
{`                              ┌────────────────────────────────┐
                              │         Wayfinder              │
                              │    (Federated Aggregator)      │
                              │                                │
                              │  • Queries across all Pods     │
                              │  • Caches for performance      │
                              │  • Provides unified search     │
                              │  • Builds knowledge graph      │
                              └───────────────┬────────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              │                               │                               │
              ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│          DSO            │     │          DCS            │     │          RTS            │
│  Digital Standards      │     │  Citizen Support        │     │  Revenue & Taxation     │
├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤
│                         │     │                         │     │                         │
│  ┌───────┐ ┌───────┐   │     │  ┌───────┐ ┌───────┐   │     │  ┌───────┐ ┌───────┐   │
│  │Identity│ │ Agent │   │     │  │Identity│ │ Agent │   │     │  │Identity│ │ Agent │   │
│  │  Pod  │ │  Pod  │   │     │  │  Pod  │ │  Pod  │   │     │  │  Pod  │ │  Pod  │   │
│  └───────┘ └───────┘   │     │  └───────┘ └───────┘   │     │  └───────┘ └───────┘   │
│       ┌───────┐        │     │       ┌───────┐        │     │       ┌───────┐        │
│       │ Data  │        │     │       │ Data  │        │     │       │ Data  │        │
│       │  Pod  │        │     │       │  Pod  │        │     │       │  Pod  │        │
│       └───────┘        │     │       └───────┘        │     │       └───────┘        │
│                         │     │                         │     │                         │
│  Owned by: DSO Teams   │     │  Owned by: DCS Teams   │     │  Owned by: RTS Teams   │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘

                    + BIA, VLA, NHDS (same pattern for all departments)`}
            </pre>
          </div>
        </div>
      </div>

      {/* Team Ownership */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Teams as Pod Owners</h2>
          <p className="govuk-body">
            A critical design decision: <strong>teams own Pods, not individuals</strong>.
          </p>

          <h3 className="govuk-heading-m">Why teams?</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>
              <strong>Continuity:</strong> People join and leave, but teams persist.
              When River Stone leaves the Puffin team, the team&apos;s services and data
              remain accessible.
            </li>
            <li>
              <strong>Collective responsibility:</strong> Services are owned by teams,
              not individuals. This matches how government actually operates.
            </li>
            <li>
              <strong>Clean access control:</strong> Team membership grants access.
              Leavers automatically lose access when removed from the team.
            </li>
            <li>
              <strong>Delegation:</strong> Teams can delegate specific permissions to
              individuals or agents without fragmenting ownership.
            </li>
          </ul>

          <div className="govuk-inset-text">
            <pre style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5', margin: 0, whiteSpace: 'pre' }}>
{`Team: Granite Platform (DSO)
├── Team WebID: https://dso.gov.uk/teams/granite#id
├── Members:
│   ├── Flint Rivers (can read/write)
│   └── Brook Alder (can read/write)
├── Agents:
│   └── granite-deploy-bot (can write to /deployments/)
└── Owns:
    ├── Identity Pod: /teams/granite/people/
    ├── Agent Pod: /teams/granite/agents/
    └── Data Pod: /teams/granite/services/`}
            </pre>
          </div>
        </div>
      </div>

      {/* Why Agent Pods */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Why a Separate Agent Pod?</h2>
          <p className="govuk-body">
            As AI agents become more prevalent in government operations, they need
            first-class identity management. A dedicated Agent Pod provides:
          </p>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Agent identity</dt>
              <dd className="govuk-summary-list__value">
                Each agent has a WebID, making their actions attributable and auditable.
                &quot;This change was made by granite-deploy-bot, authorised by Granite team.&quot;
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Scoped permissions</dt>
              <dd className="govuk-summary-list__value">
                Agents can be granted specific, limited access. A deployment bot
                can write to <code>/deployments/</code> but not <code>/services/</code>.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Audit trail</dt>
              <dd className="govuk-summary-list__value">
                Agent actions are logged in their Pod. Full history of what
                autonomous systems have done, when, and under whose authority.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Credential isolation</dt>
              <dd className="govuk-summary-list__value">
                Agent credentials and tokens are stored separately from human
                credentials, reducing blast radius if compromised.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Future-proofing</dt>
              <dd className="govuk-summary-list__value">
                As agent capabilities grow, the infrastructure is ready.
                Multi-agent collaboration, agent-to-agent trust, capability
                negotiation all build on this foundation.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Data in Pods */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Service Data in Pods</h2>
          <p className="govuk-body">
            The current demo stores services in SQLite. In production, each department&apos;s
            Data Pod would contain their services as RDF (linked data), using shared
            vocabularies for interoperability.
          </p>

          <h3 className="govuk-heading-m">Example: Service as RDF</h3>
          <div className="govuk-inset-text">
            <pre style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.4', margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
{`# In DSO's Data Pod: /services/gov-gateway.ttl

@prefix wf: <https://wayfinder.gov.uk/vocab#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix schema: <https://schema.org/> .

<#gov-gateway>
    a wf:Service ;
    dct:title "Government API Gateway" ;
    dct:description "Central API gateway for cross-department integration" ;
    wf:status "live" ;
    wf:serviceType "platform" ;
    wf:department <https://dso.gov.uk#dept> ;
    wf:maintainedBy <https://dso.gov.uk/teams/granite#id> ;
    wf:dependsOn <https://dso.gov.uk/services/auth#service> ;
    schema:documentation <https://gateway.gov.uk/docs> ;
    wf:monthlyRequests 45000000 ;
    wf:uptime 0.9995 .`}
            </pre>
          </div>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Querying across Pods</h3>
          <p className="govuk-body">
            Wayfinder would aggregate data using one of these strategies:
          </p>
          <ul className="govuk-list govuk-list--bullet">
            <li>
              <strong>SPARQL federation:</strong> Query across Pods in real-time using
              federated SPARQL endpoints.
            </li>
            <li>
              <strong>Index and fetch:</strong> Periodically index metadata for fast search,
              fetch full records on demand.
            </li>
            <li>
              <strong>Event-driven sync:</strong> Departments publish change events,
              Wayfinder subscribes and updates its cache.
            </li>
          </ul>
        </div>
      </div>

      {/* Sovereign AI Pipeline */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Sovereign AI Pipeline</h2>
          <p className="govuk-body">
            A key question: how do departments populate their Data Pods without manual data entry?
            The answer: <strong>each department runs their own AI extraction pipeline</strong>.
          </p>

          <div className="govuk-inset-text">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>Key principle:</strong> External AI never touches internal documentation.
              Departments extract and publish what they choose. Wayfinder only reads published Pods.
            </p>
          </div>
        </div>
      </div>

      {/* Sovereign Pipeline Diagram */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">Department-Controlled Extraction</h3>
          <div className="govuk-inset-text">
            <pre style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.4', margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
{`┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DEPARTMENT BOUNDARY                                         │
│                        (All processing happens inside)                                   │
│                                                                                          │
│  ┌──────────────────────┐                                                               │
│  │   Internal Sources   │                                                               │
│  ├──────────────────────┤                                                               │
│  │ • Confluence wikis   │                                                               │
│  │ • SharePoint docs    │                                                               │
│  │ • GitHub repos       │         ┌──────────────────────────────┐                      │
│  │ • ServiceNow CMDB    │────────▶│  Department's AI Pipeline    │                      │
│  │ • API specifications │         │  (Runs on dept infrastructure)│                      │
│  │ • Architecture docs  │         ├──────────────────────────────┤                      │
│  └──────────────────────┘         │                              │                      │
│         PRIVATE                   │  • Bedrock / Azure OpenAI /  │                      │
│                                   │    on-prem LLM               │                      │
│                                   │  • Entity extraction         │      ┌─────────────┐ │
│                                   │  • Relationship inference    │─────▶│  Data Pod   │ │
│                                   │  • Schema mapping            │      │  (Published)│ │
│                                   │                              │      └──────┬──────┘ │
│                                   └──────────────────────────────┘             │        │
│                                                 │                              │        │
│                                                 ▼                              │        │
│                                   ┌──────────────────────────────┐             │        │
│                                   │     Review & Approval        │             │        │
│                                   │  (Human validates before     │             │        │
│                                   │   publishing to Pod)         │             │        │
│                                   └──────────────────────────────┘             │        │
│                                                                                │        │
└────────────────────────────────────────────────────────────────────────────────┼────────┘
                                                                                 │
                                                                                 ▼
                                                              ┌──────────────────────────┐
                                                              │       Wayfinder          │
                                                              │     (Read Only)          │
                                                              │                          │
                                                              │  • Queries published     │
                                                              │    Pod data              │
                                                              │  • Never sees internal   │
                                                              │    documentation         │
                                                              │  • Builds cross-govt     │
                                                              │    knowledge graph       │
                                                              └──────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>

      {/* Why Sovereign */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Why Sovereign AI?</h3>
          <p className="govuk-body">
            Departments may have legitimate concerns about external systems processing
            their internal documentation:
          </p>

          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>Concern</th>
                <th scope="col" className="govuk-table__header">Sovereign Solution</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Data leaves our control</th>
                <td className="govuk-table__cell">
                  AI runs on your infrastructure. Data never leaves your boundary.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Sensitive info extracted</th>
                <td className="govuk-table__cell">
                  You review all extractions before publishing. Nothing goes to Pod without approval.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Vendor lock-in</th>
                <td className="govuk-table__cell">
                  Use any AI provider: Bedrock, Azure OpenAI, on-premises Llama, or custom models.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Security accreditation</th>
                <td className="govuk-table__cell">
                  Pipeline runs within existing security boundary. No new external access required.
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">What Wayfinder Provides</h3>
          <p className="govuk-body">
            To enable consistent, interoperable extraction across departments:
          </p>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Reference implementation</dt>
              <dd className="govuk-summary-list__value">
                Open source extraction pipeline that departments can fork, customise, and deploy
                on their own infrastructure. Includes connectors for common documentation sources.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Schema specification</dt>
              <dd className="govuk-summary-list__value">
                Standard RDF vocabulary for services, patterns, teams, and relationships.
                Ensures data from different departments is interoperable.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Validation tools</dt>
              <dd className="govuk-summary-list__value">
                Tools to verify Pod data matches the schema before publishing.
                Catches issues before they affect the cross-government graph.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Extraction prompts</dt>
              <dd className="govuk-summary-list__value">
                Tested prompts for entity and relationship extraction. Departments can
                use as-is or adapt to their documentation style.
              </dd>
            </div>
          </dl>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h3 className="govuk-heading-s">Extraction accuracy</h3>
            <p className="govuk-body-s">
              AI extraction typically achieves 70-80% accuracy for entity and
              relationship extraction from technical documentation.
            </p>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              The review step catches errors before publishing. Over time,
              feedback improves extraction quality.
            </p>
          </div>
        </div>
      </div>

      {/* Extraction Pipeline */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Example Extraction Pipeline</h3>
          <p className="govuk-body">
            How AI transforms documentation into structured Pod data:
          </p>

          <ol className="govuk-list govuk-list--number">
            <li>
              <strong>Source crawl</strong> &ndash; Connectors fetch content from Confluence,
              SharePoint, GitHub, etc. Respects existing access controls.
            </li>
            <li>
              <strong>Content chunking</strong> &ndash; Documents split into processable
              segments with context preservation.
            </li>
            <li>
              <strong>Entity extraction</strong> &ndash; LLM identifies services, APIs,
              teams, patterns, dependencies mentioned in the content.
            </li>
            <li>
              <strong>Relationship inference</strong> &ndash; LLM determines how entities
              relate: &quot;Service A depends on API B&quot;, &quot;Team X maintains Service Y&quot;.
            </li>
            <li>
              <strong>Schema mapping</strong> &ndash; Extracted entities mapped to
              Wayfinder RDF vocabulary.
            </li>
            <li>
              <strong>Confidence scoring</strong> &ndash; Each extraction tagged with
              confidence level. Low-confidence items flagged for human review.
            </li>
            <li>
              <strong>Human review</strong> &ndash; Staff validate extractions via
              approval workflow. Corrections fed back to improve future runs.
            </li>
            <li>
              <strong>Pod publish</strong> &ndash; Approved entities written to
              department&apos;s Data Pod as RDF.
            </li>
          </ol>

          <div className="govuk-inset-text">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>Result:</strong> Departments connect existing documentation sources,
              AI builds the catalogue, humans validate. Minimal manual data entry while
              maintaining full control and accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">Benefits of This Architecture</h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <h3 className="govuk-heading-s">Full departmental autonomy</h3>
          <p className="govuk-body-s">
            Each department controls their entire information footprint. No dependency
            on a central platform team for updates or access changes.
          </p>

          <h3 className="govuk-heading-s">No single point of failure</h3>
          <p className="govuk-body-s">
            If one department&apos;s Pods are unavailable, others continue working.
            Wayfinder degrades gracefully with cached data.
          </p>

          <h3 className="govuk-heading-s">GDPR by design</h3>
          <p className="govuk-body-s">
            Data subjects&apos; information stays with the controlling department.
            Right to erasure is straightforward: delete from the Pod.
          </p>
        </div>
        <div className="govuk-grid-column-one-half">
          <h3 className="govuk-heading-s">Scalable onboarding</h3>
          <p className="govuk-body-s">
            New departments join by setting up their 3 Pods and registering with
            Wayfinder. No schema migrations or central database changes.
          </p>

          <h3 className="govuk-heading-s">Agent-ready</h3>
          <p className="govuk-body-s">
            The Agent Pod layer is ready for AI integration. As departments adopt
            AI assistants, they have infrastructure for identity and audit.
          </p>

          <h3 className="govuk-heading-s">Standards-based</h3>
          <p className="govuk-body-s">
            Built on W3C Solid, RDF, and linked data standards. No vendor lock-in,
            multiple implementation options.
          </p>
        </div>
      </div>

      {/* Considerations */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Implementation Considerations</h2>

          <div className="govuk-warning-text">
            <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
            <strong className="govuk-warning-text__text">
              <span className="govuk-visually-hidden">Warning</span>
              This architecture requires careful planning and cross-department coordination.
            </strong>
          </div>

          <h3 className="govuk-heading-m">Vocabulary governance</h3>
          <p className="govuk-body">
            <strong>Largely solved by the reference implementation.</strong> When departments
            use the provided extraction pipeline and validation tools, vocabulary compliance
            is automatic&mdash;the schema is embedded in the tools themselves.
          </p>
          <p className="govuk-body">
            Governance shifts from &quot;negotiate shared vocabularies&quot; to
            &quot;maintain the reference implementation&quot;. A central standards body
            (like DSO) would own the reference tools and evolve the schema over time,
            with departments simply updating their pipeline version.
          </p>

          <h3 className="govuk-heading-m">Performance tuning</h3>
          <p className="govuk-body">
            Federated queries are slower than local database queries. Caching strategy,
            cache invalidation, and index freshness need careful design.
          </p>

          <h3 className="govuk-heading-m">Operational maturity</h3>
          <p className="govuk-body">
            Each department needs capability to run Pod infrastructure. This could be
            managed service, shared infrastructure, or federated hosting.
          </p>

          <h3 className="govuk-heading-m">Migration path</h3>
          <p className="govuk-body">
            Moving from centralised to federated requires a transition plan. Likely
            a hybrid period where both models coexist, with gradual migration.
          </p>
        </div>
      </div>

      {/* AWS Implementation */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">AWS Production Architecture</h2>
          <p className="govuk-body">
            The original competition proposal identified AWS Neptune, OpenSearch, and Bedrock
            as the technology stack. These remain valuable, but their role changes in the
            federated model: they become the <strong>discovery layer</strong>, not the source of truth.
          </p>
          <div className="govuk-inset-text">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>Note:</strong> The Bedrock AI in this discovery layer serves a different
              purpose than the sovereign AI pipeline. Discovery layer AI handles query parsing,
              summarisation, and recommendations. Sovereign AI (run by departments) handles
              entity extraction from internal documentation. Two distinct uses of AI.
            </p>
          </div>
        </div>
      </div>

      {/* Event-Driven Architecture Diagram */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">Event-Driven Federation</h3>
          <p className="govuk-body">
            Solid Pods remain the source of truth. AWS services provide a read-optimized
            index for fast cross-government discovery:
          </p>
          <div className="govuk-inset-text">
            <pre style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.4', margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
{`┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              CENTRAL DISCOVERY LAYER (AWS)                              │
│                          Read-optimized index, not source of truth                      │
│                                                                                         │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐                    │
│  │  Amazon Neptune  │   │ Amazon OpenSearch│   │  Amazon Bedrock  │                    │
│  │   (Graph DB)     │   │ (Vector Search)  │   │  (Claude / AI)   │                    │
│  ├──────────────────┤   ├──────────────────┤   ├──────────────────┤                    │
│  │ • Cross-govt     │   │ • Semantic search│   │ • Query parsing  │                    │
│  │   relationships  │   │ • Embeddings     │   │ • Summarisation  │                    │
│  │ • Dependency     │   │ • Fuzzy matching │   │ • Recommendations│                    │
│  │   graph          │   │ • Faceted filter │   │ • Classification │                    │
│  └────────▲─────────┘   └────────▲─────────┘   └────────▲─────────┘                    │
│           │                      │                      │                               │
│           └──────────────────────┼──────────────────────┘                               │
│                                  │                                                      │
│                     ┌────────────▼────────────┐                                         │
│                     │    Sync Service         │                                         │
│                     │  (Lambda + EventBridge) │                                         │
│                     │                         │                                         │
│                     │ • Subscribes to Pod     │                                         │
│                     │   change events         │                                         │
│                     │ • Transforms RDF → index│                                         │
│                     │ • Maintains provenance  │                                         │
│                     └────────────▲────────────┘                                         │
│                                  │                                                      │
└──────────────────────────────────┼──────────────────────────────────────────────────────┘
                                   │ Webhook / Events
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   DSO Solid Pods    │  │   DCS Solid Pods    │  │   RTS Solid Pods    │
│   (ECS / Fargate)   │  │   (ECS / Fargate)   │  │   (ECS / Fargate)   │
├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤
│ Identity │ Agent    │  │ Identity │ Agent    │  │ Identity │ Agent    │
│   Pod    │  Pod     │  │   Pod    │  Pod     │  │   Pod    │  Pod     │
│    ┌─────────┐      │  │    ┌─────────┐      │  │    ┌─────────┐      │
│    │Data Pod │      │  │    │Data Pod │      │  │    │Data Pod │      │
│    │  (S3)   │      │  │    │  (S3)   │      │  │    │  (S3)   │      │
│    └─────────┘      │  │    └─────────┘      │  │    └─────────┘      │
│                     │  │                     │  │                     │
│ SOURCE OF TRUTH     │  │ SOURCE OF TRUTH     │  │ SOURCE OF TRUTH     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>

      {/* AWS Services Breakdown */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">AWS Service Roles</h3>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-one-half">
          <table className="govuk-table">
            <caption className="govuk-table__caption govuk-table__caption--s">Discovery Layer</caption>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>Service</th>
                <th scope="col" className="govuk-table__header">Purpose</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Neptune</th>
                <td className="govuk-table__cell">
                  Stores cross-government relationship graph. Enables queries like
                  &quot;what depends on this API?&quot; across all departments.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">OpenSearch</th>
                <td className="govuk-table__cell">
                  Vector embeddings for semantic search. Understands &quot;benefit data API&quot;
                  matches &quot;welfare integration service&quot;.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Bedrock</th>
                <td className="govuk-table__cell">
                  Claude for natural language queries, summarisation, and intelligent
                  recommendations. Generates embeddings for OpenSearch.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">API Gateway</th>
                <td className="govuk-table__cell">
                  Unified query API. Rate limiting, authentication, request routing.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="govuk-grid-column-one-half">
          <table className="govuk-table">
            <caption className="govuk-table__caption govuk-table__caption--s">Pod Infrastructure</caption>
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>Service</th>
                <th scope="col" className="govuk-table__header">Purpose</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">ECS Fargate</th>
                <td className="govuk-table__cell">
                  Runs Community Solid Server instances per department. Serverless,
                  scales automatically, no server management.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">S3</th>
                <td className="govuk-table__cell">
                  Storage backend for Pod data. Versioning, encryption at rest,
                  cross-region replication for resilience.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">EventBridge</th>
                <td className="govuk-table__cell">
                  Pod change notifications. When data changes in a Pod, events
                  trigger sync to the discovery layer.
                </td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Lambda</th>
                <td className="govuk-table__cell">
                  Sync functions. Transform RDF from Pods into Neptune/OpenSearch
                  formats. Maintain data provenance.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Query Flow */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Query Flow Example</h3>
          <p className="govuk-body">
            When a user asks &quot;How do I integrate with DWP benefit data?&quot;:
          </p>

          <ol className="govuk-list govuk-list--number">
            <li>
              <strong>Bedrock parses the query</strong> &ndash; Extracts intent (integration),
              domain (benefits), target (DWP-like department)
            </li>
            <li>
              <strong>OpenSearch finds candidates</strong> &ndash; Semantic search returns
              relevant services: &quot;Benefit Verification API&quot;, &quot;Welfare Data Gateway&quot;
            </li>
            <li>
              <strong>Neptune enriches results</strong> &ndash; Adds relationships: maintainers,
              dependencies, departments already integrating
            </li>
            <li>
              <strong>Bedrock summarises</strong> &ndash; Generates a helpful response with
              links to documentation
            </li>
            <li>
              <strong>Links to source Pods</strong> &ndash; All results link back to the
              authoritative data in department Pods
            </li>
          </ol>

          <div className="govuk-inset-text">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>Key principle:</strong> The discovery layer is a cache, not the source.
              If it&apos;s ever inconsistent, the Pod is authoritative. The index can be
              completely rebuilt from Pod data at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Sync Strategy */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Sync Strategy</h3>
          <p className="govuk-body">
            Keeping the discovery index fresh without polling every Pod constantly:
          </p>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Event-driven updates</dt>
              <dd className="govuk-summary-list__value">
                Pods emit events via webhooks when data changes. EventBridge routes
                to Lambda sync functions. Near real-time updates (seconds, not hours).
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Periodic reconciliation</dt>
              <dd className="govuk-summary-list__value">
                Daily full crawl catches any missed events. Compares Pod state to index,
                updates differences. Belt and braces.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Provenance tracking</dt>
              <dd className="govuk-summary-list__value">
                Every indexed record stores: source Pod URL, last sync time, content hash.
                Enables staleness detection and audit.
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Graceful degradation</dt>
              <dd className="govuk-summary-list__value">
                If a department&apos;s Pods are unreachable, cached data is served with
                a staleness indicator. System continues functioning.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Security Architecture */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Security Architecture</h3>
          <p className="govuk-body">
            The architecture addresses NCSC cloud security principles:
          </p>

          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '30%' }}>Concern</th>
                <th scope="col" className="govuk-table__header">Approach</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Data in transit</th>
                <td className="govuk-table__cell">TLS 1.3 everywhere. mTLS between services.</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Data at rest</th>
                <td className="govuk-table__cell">S3 encryption with department-managed KMS keys.</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Access control</th>
                <td className="govuk-table__cell">Solid WAC (Web Access Control) for Pod data. IAM for AWS services.</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Identity</th>
                <td className="govuk-table__cell">WebID for users/agents. OIDC for AWS service authentication.</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Audit</th>
                <td className="govuk-table__cell">CloudTrail for AWS. Pod access logs for Solid. Centralised in CloudWatch.</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Network isolation</th>
                <td className="govuk-table__cell">VPC per department. PrivateLink for cross-account access.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Model */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Cost Considerations</h3>
          <p className="govuk-body">
            Rough order-of-magnitude for a cross-government deployment:
          </p>

          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">Component</th>
                <th scope="col" className="govuk-table__header">Sizing</th>
                <th scope="col" className="govuk-table__header" style={{ width: '25%' }}>Est. Monthly</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Neptune (db.r5.large)</td>
                <td className="govuk-table__cell">Graph with 100K nodes, 500K edges</td>
                <td className="govuk-table__cell">~£500</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">OpenSearch (3x m5.large)</td>
                <td className="govuk-table__cell">10GB index, vector search enabled</td>
                <td className="govuk-table__cell">~£400</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Bedrock (Claude)</td>
                <td className="govuk-table__cell">50K queries/month, avg 1K tokens</td>
                <td className="govuk-table__cell">~£800</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">ECS Fargate (per dept)</td>
                <td className="govuk-table__cell">2 tasks, 0.5 vCPU, 1GB each</td>
                <td className="govuk-table__cell">~£50/dept</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">S3 + data transfer</td>
                <td className="govuk-table__cell">50GB storage, moderate traffic</td>
                <td className="govuk-table__cell">~£100</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell"><strong>Total (20 depts)</strong></td>
                <td className="govuk-table__cell"></td>
                <td className="govuk-table__cell"><strong>~£3,800/mo</strong></td>
              </tr>
            </tbody>
          </table>

          <p className="govuk-body-s govuk-!-margin-top-4">
            These are illustrative estimates. Actual costs depend on usage patterns,
            reserved instance commitments, and negotiated pricing.
          </p>
        </div>
      </div>

      {/* Alternative Considerations */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h3 className="govuk-heading-m">Alternative Approaches</h3>
          <p className="govuk-body">
            The architecture isn&apos;t locked to AWS. Key components have alternatives:
          </p>

          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '25%' }}>AWS Service</th>
                <th scope="col" className="govuk-table__header">Alternatives</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Neptune</td>
                <td className="govuk-table__cell">Neo4j, TigerGraph, Azure Cosmos DB (Gremlin)</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">OpenSearch</td>
                <td className="govuk-table__cell">Elasticsearch, Pinecone, Weaviate, Azure AI Search</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Bedrock</td>
                <td className="govuk-table__cell">Azure OpenAI, Vertex AI, self-hosted Llama</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">ECS Fargate</td>
                <td className="govuk-table__cell">Azure Container Apps, GCP Cloud Run, Kubernetes</td>
              </tr>
            </tbody>
          </table>

          <p className="govuk-body govuk-!-margin-top-4">
            The Solid layer is cloud-agnostic by design. Departments could choose their
            preferred cloud while still federating through Wayfinder.
          </p>
        </div>
      </div>

      {/* Operations vs Content Administration */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Minimal Operations Footprint</h2>
          <p className="govuk-body">
            A key security benefit of the federated model: <strong>Wayfinder has no content
            administration interface</strong>. This dramatically reduces the attack surface.
          </p>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Content Administration: Not Needed</h3>
          <p className="govuk-body">
            In traditional platforms, administrators can create, edit, and delete content.
            This creates significant security risks:
          </p>
          <ul className="govuk-list govuk-list--bullet">
            <li>Compromised admin accounts can modify or destroy data</li>
            <li>Insider threats have broad access to sensitive information</li>
            <li>Admin interfaces are high-value targets for attackers</li>
            <li>Audit trails must track every admin action</li>
          </ul>
          <p className="govuk-body">
            <strong>In the federated 3-Pod model, this entire category disappears.</strong> Departments
            manage their own Pods using their own tools and access controls. Wayfinder simply
            reads published data&mdash;it cannot modify, delete, or even access unpublished content.
          </p>

          <h3 className="govuk-heading-m">Operations Administration: Minimal</h3>
          <p className="govuk-body">
            What remains is lightweight operations management, most of which can be automated:
          </p>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '25%' }}>Function</th>
                <th scope="col" className="govuk-table__header" style={{ width: '40%' }}>Description</th>
                <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>Automation</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Federation registry</td>
                <td className="govuk-table__cell">Add/remove department Pod endpoints</td>
                <td className="govuk-table__cell">Self-service via API; human approval optional</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Health monitoring</td>
                <td className="govuk-table__cell">Track Pod availability and sync status</td>
                <td className="govuk-table__cell">Fully automated with alerting</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Schema evolution</td>
                <td className="govuk-table__cell">Update reference implementation</td>
                <td className="govuk-table__cell">Version controlled; departments pull updates</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Query analytics</td>
                <td className="govuk-table__cell">Usage patterns and performance</td>
                <td className="govuk-table__cell">Fully automated dashboards</td>
              </tr>
              <tr className="govuk-table__row">
                <td className="govuk-table__cell">Incident response</td>
                <td className="govuk-table__cell">Handle federation issues</td>
                <td className="govuk-table__cell">Runbooks; most self-healing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-inset-text">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>Security principle:</strong> Wayfinder is a read-only discovery layer.
              It indexes published data but cannot modify source systems. Even if fully
              compromised, an attacker cannot alter department content&mdash;only disrupt
              discovery temporarily.
            </p>
          </div>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h4 className="govuk-heading-s govuk-!-margin-bottom-2">Attack surface comparison</h4>
            <dl className="govuk-summary-list govuk-summary-list--no-border">
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key" style={{ fontSize: '14px' }}>Traditional</dt>
                <dd className="govuk-summary-list__value" style={{ fontSize: '14px' }}>
                  Admin can read, write, delete all content
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key" style={{ fontSize: '14px' }}>Federated</dt>
                <dd className="govuk-summary-list__value" style={{ fontSize: '14px' }}>
                  Central layer is read-only; no content access
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">From Demo to Production</h2>
          <p className="govuk-body">
            This demo proves the concept. Moving to production would involve:
          </p>
          <ol className="govuk-list govuk-list--number">
            <li>Define the Wayfinder RDF vocabulary for services, patterns, teams</li>
            <li>Build and open-source the reference extraction pipeline with embedded schema</li>
            <li>Pilot with one department: deploy 3-Pod model and run sovereign AI extraction</li>
            <li>Build the central discovery layer (Neptune, OpenSearch, Bedrock for queries)</li>
            <li>Onboard additional departments using the reference implementation</li>
            <li>Evolve vocabulary via reference implementation updates (not negotiations)</li>
            <li>Add Agent Pod capabilities as AI adoption grows</li>
          </ol>

          <div className="govuk-button-group govuk-!-margin-top-6">
            <Link href="/about" className="govuk-button govuk-button--secondary" data-module="govuk-button">
              Back to About
            </Link>
            <Link href="/graph" className="govuk-button" data-module="govuk-button">
              Explore the demo
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
