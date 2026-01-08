/**
 * Authenticated Admin Layout
 *
 * Server component that checks authentication and wraps admin pages.
 * Redirects to sign-in if not authenticated.
 */

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminNav } from '@/components/admin/AdminNav';

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session server-side
  const { session, user } = await getSession();

  if (!session || !user) {
    redirect('/admin/sign-in');
  }

  return (
    <>
      <AdminHeader
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />

      <div className="govuk-width-container">
        {/* Phase banner */}
        <div className="govuk-phase-banner">
          <p className="govuk-phase-banner__content">
            <strong className="govuk-tag govuk-phase-banner__content__tag">ADMIN</strong>
            <span className="govuk-phase-banner__text">
              You are in the administration area.{' '}
              <a className="govuk-link" href="/">
                Return to public site
              </a>
            </span>
          </p>
        </div>

        <main className="govuk-main-wrapper" id="main-content" role="main">
          <div className="govuk-grid-row">
            {/* Side navigation */}
            <div className="govuk-grid-column-one-quarter">
              <AdminNav />
            </div>

            {/* Main content */}
            <div className="govuk-grid-column-three-quarters">{children}</div>
          </div>
        </main>
      </div>

      <footer className="govuk-footer" role="contentinfo">
        <div className="govuk-width-container">
          <div className="govuk-footer__meta">
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
              <span className="govuk-footer__licence-description">
                Wayfinder Admin - Demo Environment
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
