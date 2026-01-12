import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PodViewerPageProps {
  searchParams: Promise<{ webId?: string }>;
}

interface PodProfile {
  name?: string;
  role?: string;
  email?: string;
  skills?: string[];
  rawTurtle?: string;
}

/**
 * Fetch and parse a Solid Pod profile server-side
 * This runs on the Next.js server which can reach localhost:3002
 */
async function fetchPodProfile(webId: string): Promise<PodProfile | null> {
  try {
    // Remove the fragment (#me) to get the document URL
    const documentUrl = webId.split('#')[0];

    const response = await fetch(documentUrl, {
      headers: {
        Accept: 'text/turtle',
      },
      // No cache to always get fresh Pod data
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Pod returned ${response.status} for ${documentUrl}`);
      return null;
    }

    const turtle = await response.text();

    // Parse the Turtle to extract profile fields
    // Simple regex parsing - in production you'd use a proper RDF parser
    const profile: PodProfile = {
      rawTurtle: turtle,
    };

    // Extract name (foaf:name or vcard:fn)
    const nameMatch = turtle.match(/(?:foaf:name|vcard:fn)\s+"([^"]+)"/);
    if (nameMatch) {
      profile.name = nameMatch[1];
    }

    // Extract role (vcard:role)
    const roleMatch = turtle.match(/vcard:role\s+"([^"]+)"/);
    if (roleMatch) {
      profile.role = roleMatch[1];
    }

    // Extract email (vcard:hasEmail)
    const emailMatch = turtle.match(/vcard:hasEmail\s+<mailto:([^>]+)>/);
    if (emailMatch) {
      profile.email = emailMatch[1];
    }

    // Extract skills (vcard:note - comma separated)
    const skillsMatch = turtle.match(/vcard:note\s+"([^"]+)"/);
    if (skillsMatch) {
      profile.skills = skillsMatch[1].split(',').map((s) => s.trim());
    }

    return profile;
  } catch (error) {
    console.error(`Failed to fetch Pod profile from ${webId}:`, error);
    return null;
  }
}

export async function generateMetadata({ searchParams }: PodViewerPageProps) {
  const { webId } = await searchParams;

  if (!webId) {
    return { title: 'Pod Viewer - Wayfinder' };
  }

  const profile = await fetchPodProfile(webId);

  return {
    title: profile?.name
      ? `${profile.name}'s Pod - Wayfinder`
      : 'Pod Viewer - Wayfinder',
    description: 'View Solid Pod profile data',
  };
}

export default async function PodViewerPage({ searchParams }: PodViewerPageProps) {
  const { webId } = await searchParams;

  if (!webId) {
    notFound();
  }

  const decodedWebId = decodeURIComponent(webId);
  const profile = await fetchPodProfile(decodedWebId);

  if (!profile) {
    return (
      <>
        <nav className="govuk-breadcrumbs" aria-label="Breadcrumb">
          <ol className="govuk-breadcrumbs__list">
            <li className="govuk-breadcrumbs__list-item">
              <Link href="/" className="govuk-breadcrumbs__link">
                Home
              </Link>
            </li>
            <li className="govuk-breadcrumbs__list-item" aria-current="page">
              Pod Viewer
            </li>
          </ol>
        </nav>

        <div className="govuk-grid-row govuk-!-margin-top-6">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">Unable to fetch Pod data</h1>
            <p className="govuk-body">
              Could not retrieve data from the Solid Pod at:
            </p>
            <p className="govuk-body">
              <code className="govuk-!-font-size-14">{decodedWebId}</code>
            </p>
            <p className="govuk-body">
              This could mean the Pod server is not running or the profile does not exist.
            </p>
          </div>
        </div>
      </>
    );
  }

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
          <li className="govuk-breadcrumbs__list-item" aria-current="page">
            Pod Viewer
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption-l">Solid Pod Profile</span>
          <h1 className="govuk-heading-l">
            {profile.name || 'Unknown Profile'}
          </h1>
        </div>
      </div>

      {/* Pod Source Banner */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <div className="govuk-notification-banner govuk-notification-banner--success" role="region" aria-labelledby="pod-banner-title">
            <div className="govuk-notification-banner__header">
              <h2 className="govuk-notification-banner__title" id="pod-banner-title">
                Live Pod Data
              </h2>
            </div>
            <div className="govuk-notification-banner__content">
              <p className="govuk-notification-banner__heading">
                This data was fetched directly from a Solid Pod
              </p>
              <p className="govuk-body">
                WebID: <code className="govuk-!-font-size-14">{decodedWebId}</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Data */}
      <div className="govuk-grid-row govuk-!-margin-top-4">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-m">Profile Information</h2>

          <dl className="govuk-summary-list">
            {profile.name && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Name</dt>
                <dd className="govuk-summary-list__value">{profile.name}</dd>
              </div>
            )}
            {profile.role && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Role</dt>
                <dd className="govuk-summary-list__value">{profile.role}</dd>
              </div>
            )}
            {profile.email && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Email</dt>
                <dd className="govuk-summary-list__value">
                  <a href={`mailto:${profile.email}`} className="govuk-link">
                    {profile.email}
                  </a>
                </dd>
              </div>
            )}
            {profile.skills && profile.skills.length > 0 && (
              <div className="govuk-summary-list__row">
                <dt className="govuk-summary-list__key">Skills</dt>
                <dd className="govuk-summary-list__value">
                  <ul className="govuk-list">
                    {profile.skills.map((skill) => (
                      <li key={skill}>
                        <span className="govuk-tag govuk-tag--grey govuk-!-margin-right-1 govuk-!-margin-bottom-1">
                          {skill}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="govuk-grid-column-one-third">
          <h2 className="govuk-heading-s">About Solid Pods</h2>
          <p className="govuk-body-s">
            This profile is stored in a <strong>Solid Pod</strong> - a personal
            data store that the owner controls. Unlike traditional databases,
            the data lives with the person, not the application.
          </p>
          <p className="govuk-body-s">
            <a
              href="https://solidproject.org/"
              className="govuk-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about Solid
            </a>
          </p>
        </div>
      </div>

      {/* Raw RDF Data */}
      <div className="govuk-grid-row govuk-!-margin-top-6">
        <div className="govuk-grid-column-full">
          <details className="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                View raw RDF data (Turtle format)
              </span>
            </summary>
            <div className="govuk-details__text">
              <p className="govuk-body-s">
                This is the actual data stored in the Pod, in Turtle (RDF) format:
              </p>
              <pre
                className="govuk-!-font-size-14"
                style={{
                  backgroundColor: '#f3f2f1',
                  padding: '15px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  borderLeft: '4px solid #1d70b8',
                }}
              >
                <code>{profile.rawTurtle}</code>
              </pre>
            </div>
          </details>
        </div>
      </div>
    </>
  );
}
