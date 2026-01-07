import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPatternById, getServiceById } from '@/lib/data';
import { PatternCard } from '@/components/cards/PatternCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { ContributorList } from '@/components/ContributorList';
import { CodeBlock } from '@/components/CodeBlock';

interface PatternPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PatternPageProps) {
  const { id } = await params;
  const pattern = getPatternById(id);

  if (!pattern) {
    return { title: 'Pattern Not Found - Wayfinder' };
  }

  return {
    title: `${pattern.name} - Wayfinder`,
    description: pattern.description,
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { id } = await params;
  const pattern = getPatternById(id);

  if (!pattern) {
    notFound();
  }

  const implementingServices = pattern.implementedBy
    .map((serviceId) => getServiceById(serviceId))
    .filter(Boolean);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <Link href="/" className="govuk-breadcrumbs__link">
              Home
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <Link href="/patterns" className="govuk-breadcrumbs__link">
              Patterns
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {pattern.name}
          </li>
        </ol>
      </nav>

      {/* Pattern Header */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-tag">{pattern.category}</span>

          <h1 className="govuk-heading-xl govuk-!-margin-top-4">{pattern.name}</h1>
          <p className="govuk-body-l">{pattern.description}</p>
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">The Problem</h2>
          <p className="govuk-body">{pattern.problem}</p>
        </div>

        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">The Solution</h2>
          <p className="govuk-body">{pattern.solution}</p>
        </div>
      </div>

      {/* Consequences */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Consequences &amp; Trade-offs</h2>
          <ul className="govuk-list govuk-list--bullet">
            {pattern.consequences.map((consequence, index) => (
              <li key={index}>{consequence}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Code Example */}
      {pattern.codeExample && (
        <div className="govuk-grid-row govuk-!-margin-top-6">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-m">Example</h2>
            <p className="govuk-body">{pattern.codeExample.description}</p>
            <CodeBlock
              code={pattern.codeExample.code}
              language={pattern.codeExample.language}
            />
          </div>
        </div>
      )}

      {/* Diagram */}
      {pattern.diagram && (
        <div className="govuk-grid-row govuk-!-margin-top-6">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-m">Architecture</h2>
            <div className="govuk-inset-text">
              <pre className="govuk-!-font-size-14">{pattern.diagram}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Implementing Services */}
      {implementingServices.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Implemented by ({implementingServices.length} services)
            </h2>
            <div className="wayfinder-grid wayfinder-grid--3-col">
              {implementingServices.map((service) =>
                service ? (
                  <ServiceCard key={service.id} service={service} compact />
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contributors */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Contributors</h2>
          <p className="govuk-body govuk-!-margin-bottom-4">
            Teams who contributed to this pattern. Profile data is fetched from
            their Solid Pods.
          </p>
          <ContributorList contributors={pattern.contributors} />
        </div>
      </div>

      {/* Related Patterns */}
      {pattern.relatedPatterns.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-heading-m">Related Patterns</h2>
            <ul className="govuk-list">
              {pattern.relatedPatterns.map((relatedId) => (
                <li key={relatedId}>
                  <Link href={`/patterns/${relatedId}`} className="govuk-link">
                    {relatedId}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <Link
            href={`/graph?focus=${pattern.id}`}
            className="govuk-button govuk-button--secondary"
          >
            View in knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
