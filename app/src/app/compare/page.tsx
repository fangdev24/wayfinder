/**
 * Comparison Dashboard Page
 *
 * Shows a side-by-side comparison of api.gov.uk (current state)
 * and what Wayfinder enables (proposed state).
 *
 * Designed to inform stakeholder decisions without being
 * confrontational to existing work.
 */

import Link from 'next/link';
import { getComparisonStats, GOVUK_STATS } from '@/lib/govuk-api';
import { CapabilityMatrix } from '@/components/compare/CapabilityMatrix';
import { GovernanceComparison } from '@/components/compare/GovernanceComparison';
import { DecisionFramework } from '@/components/compare/DecisionFramework';
import { ExportSummary } from '@/components/compare/ExportSummary';

export const metadata = {
  title: 'Compare - Wayfinder',
  description:
    'Comparison of api.gov.uk current capabilities and what Wayfinder enables for cross-government API discovery.',
};

function StatsCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  return (
    <div
      className="govuk-!-padding-4"
      style={{
        background: '#f3f2f1',
        borderLeft: `5px solid ${color}`,
        textAlign: 'center',
      }}
    >
      <p className="govuk-body-s govuk-!-margin-bottom-1" style={{ color: '#505a5f' }}>
        {title}
      </p>
      <p
        className="govuk-heading-xl govuk-!-margin-bottom-1"
        style={{ color }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>
        {subtitle}
      </p>
    </div>
  );
}

export default function ComparePage() {
  const stats = getComparisonStats();

  return (
    <>
      {/* Hero Section */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Capability Assessment</span>
          <h1 className="govuk-heading-xl">Current State vs Future Possibilities</h1>
          <p className="govuk-body-l">
            The UK government has made significant progress with{' '}
            <a
              href={GOVUK_STATS.source}
              className="govuk-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              api.gov.uk
            </a>{' '}
            — the foundation for cross-government API discovery. This comparison shows what
            additional capabilities become possible with federated data architecture.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-!-padding-4 govuk-!-margin-top-4"
            style={{ background: '#f3f2f1', borderLeft: '5px solid #1d70b8' }}
          >
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>This is a demonstration.</strong> Data shown is fictional but
              modelled on real government patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-m">At a Glance</h2>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-one-quarter">
          <StatsCard
            title="api.gov.uk APIs"
            value={stats.govuk.totalApis}
            subtitle="catalogued today"
            color="#1d70b8"
          />
        </div>
        <div className="govuk-grid-column-one-quarter">
          <StatsCard
            title="Policy Visibility"
            value="0%"
            subtitle="governance tracked"
            color="#d4351c"
          />
        </div>
        <div className="govuk-grid-column-one-quarter">
          <StatsCard
            title="Wayfinder Demo"
            value={stats.wayfinder.totalServices}
            subtitle="enriched services"
            color="#00703c"
          />
        </div>
        <div className="govuk-grid-column-one-quarter">
          <StatsCard
            title="Relationships"
            value={stats.wayfinder.relationships}
            subtitle="in knowledge graph"
            color="#00703c"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="govuk-!-margin-bottom-8" aria-label="Page sections">
        <h2 className="govuk-heading-s">On this page</h2>
        <ul className="govuk-list">
          <li>
            <a href="#capabilities" className="govuk-link">
              Capability comparison
            </a>
          </li>
          <li>
            <a href="#governance" className="govuk-link">
              Governance visibility
            </a>
          </li>
          <li>
            <a href="#decisions" className="govuk-link">
              Decision framework
            </a>
          </li>
          <li>
            <a href="#export" className="govuk-link">
              Export summary
            </a>
          </li>
        </ul>
      </nav>

      {/* Framing Note */}
      <div
        className="govuk-!-padding-4 govuk-!-margin-bottom-8"
        style={{
          background: '#f3f2f1',
          border: '1px solid #b1b4b6',
        }}
      >
        <h3 className="govuk-heading-s">How to read this comparison</h3>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>This is not a criticism</strong> of api.gov.uk. The existing catalogue
              represents years of valuable work and provides genuine utility. Policy tracking,
              relationship mapping, and agent access were outside its original scope.
            </p>
          </div>
          <div className="govuk-grid-column-one-half">
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              <strong>This is an extension</strong> showing what becomes possible with
              federated data (Solid Pods). The comparison is factual: what exists today
              versus what could exist. The decision to pursue these capabilities involves
              trade-offs in complexity versus capability.
            </p>
          </div>
        </div>
      </div>

      {/* Capability Matrix Section */}
      <section id="capabilities">
        <CapabilityMatrix />
      </section>

      {/* Governance Section */}
      <section id="governance">
        <GovernanceComparison />
      </section>

      {/* Decision Framework Section */}
      <section id="decisions">
        <DecisionFramework />
      </section>

      {/* Export Section */}
      <section id="export">
        <ExportSummary />
      </section>

      {/* Call to Action */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Explore the Demo</h2>
          <p className="govuk-body">
            See these capabilities in action with the Wayfinder demo. The demo uses
            fictional data modelled on real government patterns.
          </p>
          <div className="govuk-button-group">
            <Link href="/graph" className="govuk-button" data-module="govuk-button">
              View knowledge graph
            </Link>
            <Link
              href="/policies"
              className="govuk-button govuk-button--secondary"
              data-module="govuk-button"
            >
              Browse policies
            </Link>
            <Link
              href="/about"
              className="govuk-button govuk-button--secondary"
              data-module="govuk-button"
            >
              About Wayfinder
            </Link>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className="govuk-grid-row govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-s">Sources</h2>
          <ul className="govuk-list govuk-body-s">
            <li>
              <a
                href="https://www.api.gov.uk/"
                className="govuk-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                api.gov.uk - UK Government API Catalogue
              </a>
            </li>
            <li>
              <a
                href="https://github.com/co-cddo/api-catalogue"
                className="govuk-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub - co-cddo/api-catalogue
              </a>
            </li>
            <li>
              <a
                href="https://dataingovernment.blog.gov.uk/2025/04/03/joining-up-the-dots-the-findings-of-our-recent-api-discovery/"
                className="govuk-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Discovery Findings (April 2025) - Data in Government Blog
              </a>
            </li>
            <li>
              <a
                href="https://dataingovernment.blog.gov.uk/2025/11/28/strengthening-and-extending-connectivity-what-we-learned-from-the-api-hub-alpha/"
                className="govuk-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Hub Alpha Learnings (November 2025) - Data in Government Blog
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
