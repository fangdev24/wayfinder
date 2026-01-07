import type { Service } from '@/lib/data';
import { ServiceCard } from '@/components/cards/ServiceCard';

interface ServiceListProps {
  services: Service[];
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="govuk-!-padding-6 govuk-!-text-align-centre">
        <p className="govuk-body">No services found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="wayfinder-grid wayfinder-grid--2-col">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
