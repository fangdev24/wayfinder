import Link from 'next/link';
import type { SimpleRelationship } from '@/lib/data';
import { getServiceById } from '@/lib/data';

interface RelationshipListProps {
  relationships: SimpleRelationship[];
  currentServiceId: string;
}

export function RelationshipList({ relationships, currentServiceId }: RelationshipListProps) {
  if (relationships.length === 0) {
    return (
      <p className="govuk-body">No relationships documented yet.</p>
    );
  }

  // Group by relationship type
  const grouped = relationships.reduce((acc, rel) => {
    const type = rel.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(rel);
    return acc;
  }, {} as Record<string, SimpleRelationship[]>);

  return (
    <div>
      {Object.entries(grouped).map(([type, rels]) => (
        <div key={type} className="govuk-!-margin-bottom-4">
          <h4 className="govuk-heading-s">{formatRelationshipType(type)}</h4>
          <ul className="govuk-list govuk-list--bullet">
            {rels.map((rel) => {
              const targetId = rel.source === currentServiceId ? rel.target : rel.source;
              const targetService = getServiceById(targetId);
              const isCrossDepartment = rel.crossDepartment;

              return (
                <li key={`${rel.source}-${rel.target}-${rel.type}`}>
                  <Link href={`/services/${targetId}`} className="govuk-link">
                    {targetService?.name || targetId}
                  </Link>
                  {isCrossDepartment && (
                    <span className="wayfinder-relationship wayfinder-relationship--cross-department govuk-!-margin-left-2">
                      Cross-department
                    </span>
                  )}
                  {rel.description && (
                    <span className="govuk-body-s govuk-!-margin-left-2">
                      — {rel.description}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function formatRelationshipType(type: string): string {
  const labels: Record<string, string> = {
    'depends-on': 'Depends on',
    'consumed-by': 'Consumed by',
    'publishes-to': 'Publishes to',
    'subscribes-to': 'Subscribes to',
    'authenticates-via': 'Authenticates via',
    'implements': 'Implements pattern',
  };
  return labels[type] || type;
}
