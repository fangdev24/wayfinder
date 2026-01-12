import Link from 'next/link';
import { agents, stats, departments } from '@/lib/data';
import { AgentCard } from '@/components/cards/AgentCard';

export const metadata = {
  title: 'Agent Registry - Wayfinder',
  description: 'Browse AI agents and automation bots across government',
};

export default function AgentsPage() {
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">Agent Registry</h1>
          <p className="govuk-body-l">
            Browse AI agents and automation bots operating across government.
            Each agent shows its capabilities, permissions, and owning team.
          </p>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-!-padding-4" style={{ background: '#f3f2f1' }}>
            <h2 className="govuk-heading-m">{stats.agents} agents</h2>
            <ul className="govuk-list govuk-list--bullet">
              <li>Discovery: {stats.agentsByType.discovery}</li>
              <li>Operations: {stats.agentsByType.operations}</li>
              <li>Compliance: {stats.agentsByType.compliance}</li>
              <li>Support: {stats.agentsByType.support}</li>
              <li>Data: {stats.agentsByType.data}</li>
              <li>Intelligence: {stats.agentsByType.intelligence}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Agents by Department */}
      {departments.map((dept) => {
        const deptAgents = agents.filter((a) => a.departmentId === dept.id);
        if (deptAgents.length === 0) return null;

        return (
          <div key={dept.id} className="govuk-grid-row govuk-!-margin-top-6">
            <div className="govuk-grid-column-full">
              <h2 className="govuk-heading-l">
                {dept.acronym} - {dept.name}
                <span className="govuk-body govuk-!-margin-left-2">
                  ({deptAgents.length} agent{deptAgents.length !== 1 ? 's' : ''})
                </span>
              </h2>
              <div className="govuk-grid-row">
                {deptAgents.map((agent) => (
                  <div key={agent.id} className="govuk-grid-column-one-half govuk-!-margin-bottom-4">
                    <AgentCard agent={agent} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">About agents</h2>
          <p className="govuk-body">
            Agents are autonomous software components that perform tasks on behalf of teams.
            They range from simple deployment bots to AI-powered analysis tools.
          </p>
          <p className="govuk-body">
            All agents have clear ownership, defined capabilities, and are subject to
            governance policies. Their actions are logged for audit purposes.
          </p>
          <p className="govuk-body">
            <Link href="/graph" className="govuk-link">
              Explore the knowledge graph
            </Link>{' '}
            to see how agents connect to services and teams.
          </p>
        </div>
      </div>
    </>
  );
}
