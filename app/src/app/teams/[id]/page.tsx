import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTeamById, getServicesByTeam, getPeopleByTeam } from '@/lib/data';
import { TeamCard } from '@/components/cards/TeamCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { PersonCard } from '@/components/cards/PersonCard';
import { PodIndicator } from '@/components/solid/PodIndicator';

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TeamPageProps) {
  const { id } = await params;
  const team = getTeamById(id);

  if (!team) {
    return { title: 'Team Not Found - Wayfinder' };
  }

  return {
    title: `${team.name} - Wayfinder`,
    description: team.description,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { id } = await params;
  const team = getTeamById(id);

  if (!team) {
    notFound();
  }

  const services = getServicesByTeam(id);
  const members = getPeopleByTeam(id);

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
            <Link href="/services" className="govuk-breadcrumbs__link">
              Services
            </Link>
          </li>
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            {team.name}
          </li>
        </ol>
      </nav>

      {/* Pod Data Indicator */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <PodIndicator
            message="This team's information is fetched from their Solid Pod, not our database"
          />
        </div>
      </div>

      {/* Team Header */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-xl">{team.name}</h1>
          <p className="govuk-body-l">{team.description}</p>
        </div>

        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-s">Contact</h2>
          <p className="govuk-body">
            <a href={`mailto:${team.contact}`} className="govuk-link">
              {team.contact}
            </a>
          </p>
          <p className="govuk-body">
            Slack: <code>{team.slack}</code>
          </p>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Responsibilities</h2>
          <ul className="govuk-list govuk-list--bullet">
            {team.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Team Members */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-m">Team Members ({members.length})</h2>
          <p className="govuk-body govuk-!-margin-bottom-4">
            Member profiles are fetched from their personal Solid Pods.
          </p>
          <div className="wayfinder-grid wayfinder-grid--3-col">
            {members.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>
      </div>

      {/* Services Maintained */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-m">Services Maintained ({services.length})</h2>
          <div className="wayfinder-grid wayfinder-grid--2-col">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} compact />
            ))}
          </div>
        </div>
      </div>

      {/* View in Graph */}
      <div className="govuk-grid-row govuk-!-margin-top-8">
        <div className="govuk-grid-column-two-thirds">
          <Link
            href={`/graph?focus=${team.id}`}
            className="govuk-button govuk-button--secondary"
          >
            View in knowledge graph
          </Link>
        </div>
      </div>
    </>
  );
}
