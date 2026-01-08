import Link from 'next/link';

export const metadata = {
  title: 'Decentralised Identity - Wayfinder',
  description: 'How Solid Pods enable decentralised identity management across government',
};

export default function IdentityPage() {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Technology Demonstration</span>
          <h1 className="govuk-heading-xl">Decentralised Identity</h1>
          <p className="govuk-body-l">
            People profiles in Wayfinder are fetched from Solid Pods, not stored
            in a central database. Each department controls their own identity data.
          </p>
        </div>
      </div>

      {/* What are Solid Pods */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">What are Solid Pods?</h2>
          <p className="govuk-body">
            <strong>Solid</strong> (Social Linked Data) is a specification developed by
            Sir Tim Berners-Lee that lets people and organisations store their data in
            decentralised data stores called <strong>Pods</strong>.
          </p>
          <p className="govuk-body">
            Unlike traditional systems where a central service owns user data, Solid
            Pods give data owners full control. They decide who can access their data,
            for how long, and can revoke access at any time.
          </p>
          <p className="govuk-body">
            In government context, this means departments can participate in shared
            platforms while retaining complete sovereignty over their identity data.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-inset-text">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              Solid was created by the inventor of the World Wide Web to address
              concerns about data centralisation and give users control over their
              personal information.
            </p>
          </div>
        </div>
      </div>

      {/* How it works in Wayfinder */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">How it works in Wayfinder</h2>
          <p className="govuk-body">
            When you view a person&apos;s profile in Wayfinder, the data isn&apos;t pulled
            from our database. Instead:
          </p>

          <ol className="govuk-list govuk-list--number">
            <li>
              <strong>Discovery</strong> &ndash; Wayfinder knows the WebID (a URL identifying
              the person) from service metadata
            </li>
            <li>
              <strong>Fetch</strong> &ndash; The profile is fetched directly from the
              department&apos;s Identity Pod in real-time
            </li>
            <li>
              <strong>Display</strong> &ndash; Profile information is rendered, always
              reflecting the current state in the Pod
            </li>
          </ol>

          <p className="govuk-body">
            This means if someone changes roles, updates their contact details, or leaves
            the organisation, those changes are immediately reflected everywhere their
            profile appears&mdash;without Wayfinder needing to be updated.
          </p>
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">Technical implementation</h2>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <div style={{ background: '#f3f2f1', padding: '24px', fontFamily: 'monospace', fontSize: '14px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`┌─────────────────┐     ┌──────────────────────────────────────┐
│    Wayfinder    │     │       Department Identity Pod        │
│                 │     │                                      │
│  "Show me the   │────▶│  https://id.dso.gov.uk/pod/          │
│   maintainer    │     │  ├── sarah-chen/                     │
│   of this API"  │     │  │   └── profile.ttl                 │
│                 │◀────│  │       ├── name: "Sarah Chen"      │
│  Displays live  │     │  │       ├── role: "Lead Architect"  │
│  profile data   │     │  │       └── team: "Integration"     │
└─────────────────┘     │  └── james-morrison/                 │
                        │      └── profile.ttl                 │
                        └──────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>

      {/* Benefits for Government */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Benefits for government</h2>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Departmental sovereignty</h3>
          <p className="govuk-body">
            Each department manages their own identity data. No central authority
            owns or controls staff information. Departments can join or leave
            the platform without data migration concerns.
          </p>

          <h3 className="govuk-heading-m">Single source of truth</h3>
          <p className="govuk-body">
            Staff details are maintained in one place&mdash;the department&apos;s Pod.
            Updates propagate automatically to every system that references them.
            No more inconsistent profiles across different platforms.
          </p>

          <h3 className="govuk-heading-m">Privacy by design</h3>
          <p className="govuk-body">
            Solid&apos;s access control is granular. A department can share someone&apos;s
            name and role publicly while keeping contact details restricted.
            Access can be granted to specific applications or revoked instantly.
          </p>

          <h3 className="govuk-heading-m">Interoperability</h3>
          <p className="govuk-body">
            Solid uses Linked Data standards (RDF, WebID). Any Solid-compatible
            application can read the same identity data. This enables a ecosystem
            of tools without vendor lock-in.
          </p>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h3 className="govuk-heading-s">Key standards</h3>
            <dl className="govuk-summary-list govuk-summary-list--no-border">
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key" style={{ fontSize: '14px' }}>WebID</dt>
                <dd className="govuk-summary-list__value" style={{ fontSize: '14px' }}>
                  Unique URL identifying a person
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key" style={{ fontSize: '14px' }}>RDF</dt>
                <dd className="govuk-summary-list__value" style={{ fontSize: '14px' }}>
                  Linked Data format
                </dd>
              </div>
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key" style={{ fontSize: '14px' }}>WAC</dt>
                <dd className="govuk-summary-list__value" style={{ fontSize: '14px' }}>
                  Web Access Control
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">Centralised vs decentralised identity</h2>

          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header" style={{ width: '30%' }}>Aspect</th>
                <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>Centralised</th>
                <th scope="col" className="govuk-table__header" style={{ width: '35%' }}>Decentralised (Solid)</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Data ownership</th>
                <td className="govuk-table__cell">Platform owns the data</td>
                <td className="govuk-table__cell">Department owns the data</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Updates</th>
                <td className="govuk-table__cell">Must update in each system</td>
                <td className="govuk-table__cell">Update once, reflects everywhere</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Access control</th>
                <td className="govuk-table__cell">Platform decides access</td>
                <td className="govuk-table__cell">Data owner decides access</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Vendor lock-in</th>
                <td className="govuk-table__cell">Tied to platform</td>
                <td className="govuk-table__cell">Data portable, standards-based</td>
              </tr>
              <tr className="govuk-table__row">
                <th scope="row" className="govuk-table__header">Resilience</th>
                <td className="govuk-table__cell">Single point of failure</td>
                <td className="govuk-table__cell">Distributed, no single point</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* In This Demo */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">In this demonstration</h2>
          <p className="govuk-body">
            This demo runs a local Community Solid Server that simulates departmental
            Identity Pods. Each fictional department has team members whose profiles
            are stored in and fetched from these Pods.
          </p>
          <p className="govuk-body">
            When you view a service maintainer or team member, you&apos;re seeing
            Solid in action&mdash;the data comes from the Pod, not a database.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-inset-text">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">See the full vision</h3>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              The{' '}
              <Link href="/architecture" className="govuk-link">
                production architecture
              </Link>{' '}
              page explains how Identity Pods fit into the broader 3-Pod model
              for federated government infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Explore the demo</h2>
          <p className="govuk-body">
            See decentralised identity in action by browsing services and viewing
            the maintainers&mdash;each profile is fetched live from a Solid Pod.
          </p>
          <div className="govuk-button-group">
            <Link href="/services" className="govuk-button" data-module="govuk-button">
              Browse services
            </Link>
            <Link href="/architecture" className="govuk-button govuk-button--secondary" data-module="govuk-button">
              View architecture
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
