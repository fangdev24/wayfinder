import Link from 'next/link';
import { departments } from '@/data-source/departments';

export const metadata = {
  title: 'About - Wayfinder',
  description: 'Cross-Government AI Competition Entry: Making government technical knowledge discoverable',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Cross-Government AI Competition Entry</span>
          <h1 className="govuk-heading-xl">Wayfinder</h1>
          <p className="govuk-body-l">
            Making government&apos;s technical knowledge discoverable. A working demonstration
            of how AI and graph technology can transform scattered documentation into
            unified, searchable knowledge.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4 govuk-!-margin-top-4"
            style={{ background: '#f3f2f1', borderLeft: '5px solid #00703c' }}
          >
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>Status:</strong> Competition entry accepted
            </p>
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">The Problem</h2>
          <p className="govuk-body">
            Government delivers many digital services to citizens, from Universal Credit to
            passport renewals. The developers, architects, and teams building these services
            face a critical challenge: <strong>discovering what already exists is difficult</strong>.
          </p>
          <p className="govuk-body">
            A developer at HMRC needs to integrate with DWP&apos;s benefit data, but finding the
            right API and learning from others who&apos;ve solved similar problems takes time.
            Documentation is scattered across multiple platforms, often invisible to each other.
          </p>
          <p className="govuk-body">
            Every hour spent searching is an hour not spent improving services. When teams
            rebuild solutions that already exist, it slows delivery that could be faster and
            more reliable.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h3 className="govuk-heading-s">The cost of searching</h3>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              10,000+ government digital professionals spend significant time finding
              technical documentation. Reducing search time by 50% would save hundreds
              of thousands of hours annually.
            </p>
          </div>
        </div>
      </div>

      {/* The Solution */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">The Solution</h2>
          <p className="govuk-body">
            A platform that transforms government&apos;s technical knowledge from opaque to
            discoverable. Using AI and graph technology, we create a unified, searchable
            view of digital infrastructure where APIs, patterns, and integrations are
            findable and reusable.
          </p>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Semantic search</h3>
          <p className="govuk-body">
            Teams ask natural questions: &quot;How do I securely share benefit data between
            departments?&quot; and receive APIs, code examples, architecture patterns, and
            contacts&mdash;even when documentation uses different terminology.
          </p>

          <h3 className="govuk-heading-m">Knowledge graph visualisation</h3>
          <p className="govuk-body">
            Interactive graphs show how services, APIs, and systems connect across government.
            See dependencies, find integration patterns, understand the landscape.
          </p>

          <h3 className="govuk-heading-m">Living documentation</h3>
          <p className="govuk-body">
            Each component shows who&apos;s using it, who maintains it, and links to their teams.
            Static documentation becomes collaborative knowledge that improves with use.
          </p>
        </div>
      </div>

      {/* This Demo */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">This Demonstration</h2>
          <p className="govuk-body">
            This working demo shows the core concepts with fictional data representing
            what a cross-government deployment could look like:
          </p>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1', minHeight: '200px' }}>
            <h3 className="govuk-heading-s">
              <Link href="/graph" className="govuk-link">Knowledge Graph</Link>
            </h3>
            <p className="govuk-body-s">
              Interactive visualisation of 75 services across 6 departments.
              See how systems connect, find dependencies, explore relationships.
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1', minHeight: '200px' }}>
            <h3 className="govuk-heading-s">
              <Link href="/services" className="govuk-link">Service Catalogue</Link>
            </h3>
            <p className="govuk-body-s">
              Browse APIs, platforms, and shared services by department.
              See maintainers, authentication methods, and integration patterns.
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1', minHeight: '200px' }}>
            <h3 className="govuk-heading-s">
              <Link href="/patterns" className="govuk-link">Pattern Library</Link>
            </h3>
            <p className="govuk-body-s">
              18 architecture patterns for integration, security, and data sharing.
              Learn from proven approaches used across departments.
            </p>
          </div>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1', minHeight: '200px' }}>
            <h3 className="govuk-heading-s">
              <Link href="/" className="govuk-link">Natural Language Query</Link>
            </h3>
            <p className="govuk-body-s">
              Ask questions in plain English. Get answers about APIs, maintainers,
              patterns, and integration approaches.
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1', minHeight: '200px' }}>
            <h3 className="govuk-heading-s">
              <Link href="/identity" className="govuk-link">Decentralised Identity</Link>
            </h3>
            <p className="govuk-body-s">
              People profiles fetched from Solid Pods, not stored centrally.
              Each department controls their own identity data.
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1', minHeight: '200px' }}>
            <h3 className="govuk-heading-s">
              <Link href="/architecture" className="govuk-link">Production Architecture</Link>
            </h3>
            <p className="govuk-body-s">
              Vision for federated 3-Pod model where departments retain full
              autonomy over identity, agents, and data.
            </p>
          </div>
        </div>
      </div>

      {/* Impact */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Impact</h2>
          <p className="govuk-body">
            Faster delivery of digital services. Less time searching. Better citizen
            experiences as government learns to build consistently across departments.
          </p>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Time savings</dt>
              <dd className="govuk-summary-list__value">
                50% reduction in time spent finding technical documentation&mdash;hundreds
                of thousands of hours saved annually
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Reduced duplication</dt>
              <dd className="govuk-summary-list__value">
                Increased reuse of components and patterns reduces duplication and costs
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Faster onboarding</dt>
              <dd className="govuk-summary-list__value">
                New joiners discover existing systems and capabilities quickly
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Why Now */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Why Now</h2>
          <p className="govuk-body">
            Government is investing in AI capability and digital services to deliver the
            Plan for Change. This project demonstrates <strong>practical AI that delivers
            immediate value</strong>&mdash;not via automation of jobs, but by giving civil
            servants intelligent tools.
          </p>
          <p className="govuk-body">
            Technical documentation provides quick wins and measurable ROI, establishing
            patterns for expanding to policy documentation, procurement knowledge, and
            operational procedures across government.
          </p>
        </div>
      </div>

      {/* Technical Approach */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Technical Approach</h2>
          <p className="govuk-body">
            The model is repeatable: connect documentation sources from any department,
            let AI build the graph, surface insights. Scale across government as departments
            see the value.
          </p>
          <p className="govuk-body">
            This demo extends the core concept with <strong>Solid Pods</strong> for
            decentralised identity, demonstrating how departments can participate in a
            shared knowledge graph while retaining full control over their own data.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-inset-text">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-2">Production architecture</h3>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              See the{' '}
              <Link href="/architecture" className="govuk-link">
                federated 3-Pod architecture
              </Link>{' '}
              for how this scales with departmental autonomy.
            </p>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">Departments in this demo</h2>
          <p className="govuk-body">
            Six fictional departments demonstrate how the platform would work across
            organisational boundaries:
          </p>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        {departments.map((dept) => (
          <div key={dept.id} className="govuk-grid-column-one-half govuk-!-margin-bottom-4">
            <div
              className="govuk-!-padding-3"
              style={{
                borderLeft: `4px solid ${dept.colour}`,
                background: '#f3f2f1',
              }}
            >
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
                <span style={{ color: dept.colour }}>{dept.acronym}</span>
                {' '}&ndash; {dept.name}
              </h3>
              <p className="govuk-body-s govuk-!-margin-bottom-0">
                {dept.teams.length} teams, multiple services
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Explore the vision</h2>
          <p className="govuk-body">
            This demo is a working prototype. Explore the knowledge graph, browse
            services, and see how cross-government discovery could work.
          </p>
          <div className="govuk-button-group">
            <Link href="/graph" className="govuk-button" data-module="govuk-button">
              View knowledge graph
            </Link>
            <Link href="/services" className="govuk-button govuk-button--secondary" data-module="govuk-button">
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
