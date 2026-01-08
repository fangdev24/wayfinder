'use client';

/**
 * Admin Sign-In Page
 *
 * Mock GOV.UK Sign-in styled login page.
 * In production, this would redirect to actual GOV.UK Sign-in.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Sign in failed');
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin');
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            {/* Phase banner */}
            <div className="govuk-phase-banner">
              <p className="govuk-phase-banner__content">
                <strong className="govuk-tag govuk-phase-banner__content__tag">
                  ADMIN
                </strong>
                <span className="govuk-phase-banner__text">
                  This is the administration area. Contact your organisation
                  administrator if you need access.
                </span>
              </p>
            </div>

            {/* Crown logo mock for GOV.UK Sign-in */}
            <div style={{ textAlign: 'center', marginBottom: '30px', marginTop: '20px' }}>
              <svg
                width="60"
                height="60"
                viewBox="0 0 120 120"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="60" cy="60" r="58" fill="none" stroke="#0b0c0c" strokeWidth="2" />
                <text
                  x="60"
                  y="70"
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize="40"
                  fontWeight="bold"
                  fill="#0b0c0c"
                >
                  W
                </text>
              </svg>
              <h1 className="govuk-heading-l" style={{ marginTop: '10px' }}>
                Sign in to Wayfinder Admin
              </h1>
            </div>

            {/* Error summary */}
            {error && (
              <div
                className="govuk-error-summary"
                aria-labelledby="error-summary-title"
                role="alert"
                data-module="govuk-error-summary"
              >
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                  There is a problem
                </h2>
                <div className="govuk-error-summary__body">
                  <ul className="govuk-list govuk-error-summary__list">
                    <li>
                      <a href="#email">{error}</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Sign-in form */}
            <form onSubmit={handleSubmit}>
              <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}>
                <label className="govuk-label govuk-label--s" htmlFor="email">
                  Email address
                </label>
                {error && (
                  <p id="email-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span> {error}
                  </p>
                )}
                <input
                  className={`govuk-input ${error ? 'govuk-input--error' : ''}`}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby={error ? 'email-error' : undefined}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="govuk-form-group">
                <label className="govuk-label govuk-label--s" htmlFor="password">
                  Password
                </label>
                <input
                  className="govuk-input"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="govuk-button"
                data-module="govuk-button"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Demo credentials hint */}
            <details className="govuk-details" data-module="govuk-details">
              <summary className="govuk-details__summary">
                <span className="govuk-details__summary-text">Demo credentials</span>
              </summary>
              <div className="govuk-details__text">
                <p className="govuk-body">Use any of these email addresses:</p>
                <ul className="govuk-list govuk-list--bullet">
                  <li>
                    <strong>super.admin@demo.gov.example</strong> - Super Admin
                  </li>
                  <li>
                    <strong>dso.admin@demo.gov.example</strong> - DSO Department Admin
                  </li>
                  <li>
                    <strong>dcs.admin@demo.gov.example</strong> - DCS Department Admin
                  </li>
                  <li>
                    <strong>editor@demo.gov.example</strong> - Editor
                  </li>
                  <li>
                    <strong>viewer@demo.gov.example</strong> - Viewer (read-only)
                  </li>
                </ul>
                <p className="govuk-body">
                  Password for all accounts: <strong>demo123</strong>
                </p>
              </div>
            </details>

            {/* Back link */}
            <p className="govuk-body" style={{ marginTop: '30px' }}>
              <a href="/" className="govuk-link">
                Return to Wayfinder
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
