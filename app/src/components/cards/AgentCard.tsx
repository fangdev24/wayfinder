import Link from 'next/link';
import type { Agent } from '@/lib/data';

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
  showFull?: boolean;
}

/**
 * Card component for displaying agent information
 *
 * Uses the same styling patterns as ServiceCard and TeamCard
 * for visual consistency across entity types.
 */
export function AgentCard({ agent, compact = false, showFull = false }: AgentCardProps) {
  if (compact) {
    return (
      <div className={`wayfinder-card wayfinder-card--${agent.departmentId}`}>
        <div className="wayfinder-card__header">
          <Link href={`/agents/${agent.id}`} className="govuk-link govuk-link--no-visited-state">
            <h3 className="govuk-heading-s govuk-!-margin-bottom-1">{agent.name}</h3>
          </Link>
        </div>
        <p className="govuk-body-s govuk-!-margin-bottom-2">
          {agent.description.slice(0, 100)}
          {agent.description.length > 100 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="govuk-tag govuk-tag--grey govuk-!-font-size-14">
            {agent.type}
          </span>
          <span className={`govuk-tag govuk-tag--${agent.status === 'active' ? 'green' : agent.status === 'testing' ? 'yellow' : 'grey'} govuk-!-font-size-14`}>
            {agent.status}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`wayfinder-card wayfinder-card--${agent.departmentId}`}>
      <div className="wayfinder-card__header">
        <div>
          <h2 className="wayfinder-card__title">
            <Link href={`/agents/${agent.id}`} className="govuk-link govuk-link--no-visited-state">
              {agent.name}
            </Link>
          </h2>
          <p className="wayfinder-card__subtitle">{agent.departmentId.toUpperCase()}</p>
        </div>
        <div>
          <span className={`wayfinder-tag wayfinder-tag--${agent.type}`}>{agent.type}</span>
        </div>
      </div>

      <div className="wayfinder-card__body">
        <p>{agent.description}</p>

        {showFull && (
          <>
            {/* Capabilities */}
            {agent.capabilities.length > 0 && (
              <div className="govuk-!-margin-top-4">
                <h3 className="govuk-heading-s">Capabilities</h3>
                <table className="govuk-table govuk-table--small-text-until-tablet">
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th className="govuk-table__header">Capability</th>
                      <th className="govuk-table__header">Risk</th>
                      <th className="govuk-table__header">Approval</th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body">
                    {agent.capabilities.map((cap) => (
                      <tr key={cap.name} className="govuk-table__row">
                        <td className="govuk-table__cell">
                          <strong>{cap.name}</strong>
                          <br />
                          <span className="govuk-body-s">{cap.description}</span>
                        </td>
                        <td className="govuk-table__cell">
                          <span className={`govuk-tag govuk-tag--${cap.riskLevel === 'high' ? 'red' : cap.riskLevel === 'medium' ? 'yellow' : 'green'}`}>
                            {cap.riskLevel}
                          </span>
                        </td>
                        <td className="govuk-table__cell">
                          {cap.requiresApproval ? 'Required' : 'Not required'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tags */}
            {agent.tags.length > 0 && (
              <div className="govuk-!-margin-top-4">
                <h3 className="govuk-heading-s">Tags</h3>
                <ul className="govuk-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {agent.tags.map((tag) => (
                    <li key={tag}>
                      <span className="govuk-tag govuk-tag--grey">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="wayfinder-card__footer">
        <span className={`wayfinder-tag wayfinder-tag--${agent.status}`}>{agent.status}</span>
        <span className="govuk-body-s govuk-!-margin-left-4">v{agent.version}</span>
        {agent.sourceRepository && (
          <a
            href={agent.sourceRepository}
            className="govuk-link govuk-!-margin-left-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        )}
      </div>
    </div>
  );
}
