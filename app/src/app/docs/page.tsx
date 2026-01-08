import Link from 'next/link';

export const metadata = {
  title: 'Documentation - Wayfinder',
  description: 'Service documentation in the Wayfinder demo',
};

export default function DocsPage() {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-xl">Demo Mode</span>
          <h1 className="govuk-heading-xl">Service Documentation</h1>

          <div className="govuk-inset-text">
            <p className="govuk-body">
              This is a demonstration platform. In a production environment, this page
              would link to the actual API documentation, integration guides, and
              technical specifications for each service.
            </p>
          </div>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">What documentation would include</h2>

          <p className="govuk-body">
            Each service in the catalogue would have comprehensive documentation covering:
          </p>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">API Reference</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>OpenAPI/Swagger specifications</li>
            <li>Endpoint descriptions and parameters</li>
            <li>Request and response examples</li>
            <li>Error codes and handling</li>
            <li>Rate limiting and quotas</li>
          </ul>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Integration Guides</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>Getting started tutorials</li>
            <li>Authentication setup (OAuth2, mTLS, API keys)</li>
            <li>Code examples in multiple languages</li>
            <li>Testing and sandbox environments</li>
            <li>Migration guides for version upgrades</li>
          </ul>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Operational Information</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>Service level agreements (SLAs)</li>
            <li>Uptime and availability statistics</li>
            <li>Incident response procedures</li>
            <li>Support contact details</li>
            <li>Change log and release notes</li>
          </ul>

          <h3 className="govuk-heading-m govuk-!-margin-top-6">Security &amp; Compliance</h3>
          <ul className="govuk-list govuk-list--bullet">
            <li>Data handling and privacy policies</li>
            <li>Security certifications</li>
            <li>Penetration test summaries</li>
            <li>Compliance documentation (GDPR, accessibility)</li>
          </ul>
        </div>

        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h3 className="govuk-heading-s">With the 3-Pod model</h3>
            <p className="govuk-body-s">
              Documentation would live in each department&apos;s <strong>Data Pod</strong>,
              co-located with service definitions. Access control is native to Solid,
              so sensitive technical details can be restricted to authenticated users.
            </p>
            <p className="govuk-body-s govuk-!-margin-bottom-0">
              Wayfinder fetches and deep-links directly into Pod-hosted docs.
              Departments update their own documentation without central coordination.
            </p>
          </div>
        </div>
      </div>

      {/* Example Documentation Structure */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">Example: API Documentation Structure</h2>
          <p className="govuk-body">
            Here&apos;s how documentation for a typical government API would be organised:
          </p>
        </div>
      </div>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <div style={{ background: '#f3f2f1', padding: '24px', fontFamily: 'monospace', fontSize: '14px' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`docs.service.gov.uk/
├── getting-started/
│   ├── overview
│   ├── authentication
│   ├── quick-start
│   └── environments
├── api-reference/
│   ├── endpoints/
│   │   ├── GET /v1/resources
│   │   ├── POST /v1/resources
│   │   └── ...
│   ├── schemas/
│   ├── errors/
│   └── versioning
├── guides/
│   ├── integration-patterns
│   ├── error-handling
│   ├── pagination
│   └── webhooks
├── security/
│   ├── authentication-methods
│   ├── rate-limiting
│   └── data-protection
└── support/
    ├── faq
    ├── troubleshooting
    ├── contact
    └── status-page`}
            </pre>
          </div>
        </div>
      </div>

      {/* Cross-Department Standards */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Cross-government documentation standards</h2>
          <p className="govuk-body">
            The Digital Standards Office (DSO) maintains guidelines for API documentation
            across government, ensuring consistency and discoverability:
          </p>

          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">OpenAPI 3.0+</dt>
              <dd className="govuk-summary-list__value">
                All APIs must publish machine-readable specifications
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">API Design Guide</dt>
              <dd className="govuk-summary-list__value">
                RESTful conventions, naming standards, versioning strategy
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Documentation Template</dt>
              <dd className="govuk-summary-list__value">
                Standard structure so developers know where to find information
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Accessibility</dt>
              <dd className="govuk-summary-list__value">
                Documentation must meet WCAG 2.1 AA standards
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Call to Action */}
      <div className="govuk-grid-row govuk-!-margin-top-8 govuk-!-margin-bottom-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Explore the demo</h2>
          <p className="govuk-body">
            While documentation links are placeholders in this demo, you can explore
            the service catalogue to see the metadata that would accompany real documentation.
          </p>
          <div className="govuk-button-group">
            <Link href="/services" className="govuk-button" data-module="govuk-button">
              Browse services
            </Link>
            <Link href="/patterns" className="govuk-button govuk-button--secondary" data-module="govuk-button">
              View patterns
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
