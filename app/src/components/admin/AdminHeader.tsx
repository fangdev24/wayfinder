'use client';

/**
 * Admin Header Component
 *
 * Shows current user info and sign-out button.
 * Uses GOV.UK Design System patterns.
 */

import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/admin/auth/sign-out', { method: 'POST' });
    router.push('/admin/sign-in');
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    department_admin: 'Department Admin',
    editor: 'Editor',
    viewer: 'Viewer',
  };

  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__logo">
          <a href="/admin" className="govuk-header__link govuk-header__link--homepage">
            <span className="govuk-header__logotype">
              <span className="govuk-header__logotype-text">Wayfinder Admin</span>
            </span>
          </a>
        </div>
        <div className="govuk-header__content">
          <nav aria-label="Account" className="govuk-header__navigation">
            <ul className="govuk-header__navigation-list">
              <li className="govuk-header__navigation-item">
                <span className="govuk-header__link" style={{ cursor: 'default' }}>
                  {user.name}
                  <span
                    className="govuk-tag govuk-tag--grey"
                    style={{ marginLeft: '10px', verticalAlign: 'middle' }}
                  >
                    {roleLabels[user.role] || user.role}
                  </span>
                </span>
              </li>
              <li className="govuk-header__navigation-item">
                <a href="/" className="govuk-header__link">
                  View Site
                </a>
              </li>
              <li className="govuk-header__navigation-item">
                <button
                  onClick={handleSignOut}
                  className="govuk-header__link"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    padding: 0,
                  }}
                >
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
