import Link from 'next/link';
import { services, stats, departments } from '@/lib/data';
import { ServiceList } from '@/components/ServiceList';

export const metadata = {
  title: 'Service Catalogue - Wayfinder',
  description: 'Browse APIs, platforms, and shared services across government',
};

export default function ServicesPage() {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Service Catalogue</h1>
          <p className="govuk-body-l">
            Browse APIs, platforms, libraries, and event streams across government.
            Each service shows its maintainers, dependencies, and usage patterns.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h2 className="govuk-heading-m">{stats.services} services</h2>
            <ul className="govuk-list govuk-list--bullet">
              <li>APIs: {stats.servicesByType.api}</li>
              <li>Platforms: {stats.servicesByType.platform}</li>
              <li>Libraries: {stats.servicesByType.library}</li>
              <li>Event Streams: {stats.servicesByType.eventStream}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Services by Department */}
      {departments.map((dept) => {
        const deptServices = services.filter((s) => s.departmentId === dept.id);
        if (deptServices.length === 0) return null;

        return (
          <div key={dept.id} className="govuk-grid-row govuk-!-margin-top-6">
            <div className="govuk-grid-column-full">
              <h2 className="govuk-heading-l">
                {dept.acronym} - {dept.name}
                <span className="govuk-body govuk-!-margin-left-2">
                  ({deptServices.length} services)
                </span>
              </h2>
              <ServiceList services={deptServices} />
            </div>
          </div>
        );
      })}

      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Can&apos;t find what you need?</h2>
          <p className="govuk-body">
            If the service you&apos;re looking for isn&apos;t listed, it might exist
            under a different name or in a department not yet connected to Wayfinder.
          </p>
          <p className="govuk-body">
            <Link href="/graph" className="govuk-link">
              Try exploring the knowledge graph
            </Link>{' '}
            to discover related services, or{' '}
            <Link href="/" className="govuk-link">
              search with natural language
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
