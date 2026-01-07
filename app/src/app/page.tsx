import Link from 'next/link';
import { SearchBox } from '@/components/search/SearchBox';
import { StatsPanel } from '@/components/StatsPanel';
import { AgentQueryInterface } from '@/components/AgentQueryInterface';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">
            Find APIs, patterns, and expertise across government
          </h1>
          <p className="govuk-body-l">
            Wayfinder helps you discover what already exists before you build.
            Search across departments, find integration patterns, and connect with
            the teams who can help.
          </p>
        </div>
      </div>

      {/* Agent Query Interface */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <AgentQueryInterface />
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h3 className="govuk-heading-s">Two ways to explore</h3>
            <p className="govuk-body-s govuk-!-margin-bottom-2">
              <strong>Ask Wayfinder</strong> when you know what you need.
              Get direct answers about APIs, maintainers, and patterns.
            </p>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong><Link href="/graph" className="govuk-link">Knowledge Graph</Link></strong> when you want to explore.
              Discover connections you did not know existed.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-m">
            <Link href="/graph" className="govuk-link govuk-link--no-visited-state">
              Knowledge Graph
            </Link>
          </h2>
          <p className="govuk-body">
            Explore how services, APIs, and teams connect across government
            in an interactive visualisation.
          </p>
        </div>

        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-m">
            <Link href="/services" className="govuk-link govuk-link--no-visited-state">
              Service Catalogue
            </Link>
          </h2>
          <p className="govuk-body">
            Browse APIs, platforms, and shared services by department,
            with documentation and contact details.
          </p>
        </div>

        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-m">
            <Link href="/patterns" className="govuk-link govuk-link--no-visited-state">
              Pattern Library
            </Link>
          </h2>
          <p className="govuk-body">
            Learn from proven patterns for integration, security,
            and data sharing across departments.
          </p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <StatsPanel />
        </div>
      </div>

      {/* Solid Pod Explainer */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <div className="govuk-inset-text">
            <h3 className="govuk-heading-s">Decentralised Identity</h3>
            <p className="govuk-body">
              People and team information is fetched from{' '}
              <strong>Solid Pods</strong>, not stored centrally.
              Each department controls their own identity data.
              When you click on a maintainer, you&apos;re fetching from their Pod,
              not our database.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
