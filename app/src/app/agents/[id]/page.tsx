import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAgentById,
  getAgentByWebId,
  getTeamById,
  getServiceById,
  getDepartmentById,
} from '@/lib/data';
import { AgentCard } from '@/components/cards/AgentCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PodIndicator } from '@/components/solid/PodIndicator';

interface AgentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) {
    return { title: 'Agent Not Found - Wayfinder' };
  }

  return {
    title: `${agent.name} - Wayfinder`,
    description: agent.description,
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) {
    notFound();
  }

  const team = getTeamById(agent.teamId);
  const department = getDepartmentById(agent.departmentId);
  const consumedServices = agent.consumesServices
    .map((sid) => getServiceById(sid))
    .filter(Boolean);

  // Find parent agent if this was cloned (lookup by WebID)
  const parentAgent = agent.clonedFrom
    ? getAgentByWebId(agent.clonedFrom)
    : null;

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
            <Link href="/agents" className="govuk-breadcrumbs__link">
              Agents
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {agent.name}
          </li>
        </ol>
      </nav>

      {/* Pod Data Indicator */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <PodIndicator
            message="This agent's identity is stored in a Solid Pod, providing verifiable credentials"
            webId={agent.webId}
          />
        </div>
      </div>

      {/* Agent Header */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <span className={`wayfinder-tag wayfinder-tag--${agent.type}`}>
            {agent.type}
          </span>
          <span className={`wayfinder-tag wayfinder-tag--${agent.status} govuk-!-margin-left-2`}>
            {agent.status}
          </span>

          <h1 className="govuk-heading-xl govuk-!-margin-top-4">{agent.name}</h1>
          <p className="govuk-body-l">{agent.description}</p>
        </div>
      </div>

      {/* Agent Details */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <AgentCard agent={agent} showFull />
        </div>

        <div className="govuk-grid-column-one-third">
          {/* Ownership */}
          <h2 className="govuk-heading-m">Owned by</h2>
          {team && (
            <p className="govuk-body">
              <Link href={`/teams/${team.id}`} className="govuk-link">
                {team.name}
              </Link>
            </p>
          )}
          {department && (
            <p className="govuk-body-s govuk-!-margin-top-1">
              {department.acronym} - {department.name}
            </p>
          )}

          {/* Quick Info */}
          <h2 className="govuk-heading-m govuk-!-margin-top-6">Quick info</h2>
          <dl className="govuk-summary-list govuk-summary-list--no-border">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">WebID</dt>
              <dd className="govuk-summary-list__value">
                <code className="govuk-!-font-size-14" style={{ wordBreak: 'break-all' }}>
                  {agent.webId}
                </code>
              </dd>
            </div>
            {parentAgent && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Cloned from</dt>
                <dd className="govuk-summary-list__value">
                  <Link href={`/agents/${parentAgent.id}`} className="govuk-link">
                    {parentAgent.name}
                  </Link>
                </dd>
              </div>
            )}
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Version</dt>
              <dd className="govuk-summary-list__value">{agent.version}</dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Approved by</dt>
              <dd className="govuk-summary-list__value">{agent.approvedBy}</dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Review date</dt>
              <dd className="govuk-summary-list__value">{agent.reviewDate}</dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Last active</dt>
              <dd className="govuk-summary-list__value">{agent.lastActiveAt}</dd>
            </div>
          </dl>

          {agent.sourceRepository && (
            <p className="govuk-body govuk-!-margin-top-4">
              <a
                href={agent.sourceRepository}
                className="govuk-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source code
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Permissions */}
      {agent.permissions.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">Permissions ({agent.permissions.length})</h2>
            <table className="govuk-table">
              <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                  <th className="govuk-table__header">Resource</th>
                  <th className="govuk-table__header">Actions</th>
                  <th className="govuk-table__header">Conditions</th>
                </tr>
              </thead>
              <tbody className="govuk-table__body">
                {agent.permissions.map((perm, index) => (
                  <tr key={index} className="govuk-table__row">
                    <td className="govuk-table__cell">
                      <code>{perm.resource}</code>
                    </td>
                    <td className="govuk-table__cell">
                      {perm.actions.map((action) => (
                        <span key={action} className="govuk-tag govuk-tag--grey govuk-!-margin-right-1">
                          {action}
                        </span>
                      ))}
                    </td>
                    <td className="govuk-table__cell">
                      {perm.conditions && perm.conditions.length > 0 ? (
                        perm.conditions.map((cond, i) => (
                          <span key={i} className="govuk-body-s">
                            {cond.type}: {cond.value}
                          </span>
                        ))
                      ) : (
                        <span className="govuk-body-s govuk-!-colour-secondary">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Consumed Services */}
      {consumedServices.length > 0 && (
        <div className="govuk-grid-row govuk-!-margin-top-8">
          <div className="govuk-grid-column-full">
            <h2 className="govuk-heading-m">
              Consumes services ({consumedServices.length})
            </h2>
            <div className="wayfinder-grid wayfinder-grid--3-col">
              {consumedServices.map((service) =>
                service ? (
                  <ServiceCard key={service.id} service={service} compact />
                ) : null
              )}
            </div>
          </div>
        </div>
      )}

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <Link
            href={`/graph?focus=${agent.id}`}
            className="govuk-button govuk-button--secondary"
          >
            View in knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
