'use client';

/**
 * Admin Navigation Component
 *
 * Side navigation for admin panel sections.
 * Uses GOV.UK Design System navigation patterns.
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  description?: string;
}

const navItems: NavItem[] = [
  {
    href: '/admin/services',
    label: 'Services',
    description: 'Manage service catalogue',
  },
  {
    href: '/admin/teams',
    label: 'Teams',
    description: 'Manage teams and ownership',
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections">
      <h2 className="govuk-heading-s govuk-!-margin-bottom-2">Admin sections</h2>
      <ul className="govuk-list">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} style={{ marginBottom: '10px' }}>
              <Link
                href={item.href}
                className={`govuk-link govuk-link--no-visited-state ${
                  isActive ? 'govuk-!-font-weight-bold' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
              {item.description && (
                <span className="govuk-hint govuk-!-font-size-14 govuk-!-margin-top-1 govuk-!-margin-bottom-0">
                  {item.description}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
