'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { href: '/', label: 'Search' },
  { href: '/graph', label: 'Knowledge Graph' },
  { href: '/services', label: 'Services' },
  { href: '/patterns', label: 'Patterns' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div className="govuk-header__container govuk-width-container">
        <div className="govuk-header__logo">
          <Link href="/" className="govuk-header__link govuk-header__link--homepage">
            <span className="govuk-header__logotype">
              <span className="govuk-header__logotype-text">Wayfinder</span>
            </span>
            <span className="govuk-header__product-name">
              Cross-Government Knowledge Platform
              <strong className="govuk-tag govuk-tag--blue govuk-!-margin-left-2" style={{ verticalAlign: 'middle', fontSize: '12px' }}>
                BETA
              </strong>
            </span>
          </Link>
        </div>

        <div className="govuk-header__content">
          <nav aria-label="Menu" className="govuk-header__navigation">
            <button
              type="button"
              className="govuk-header__menu-button govuk-js-header-toggle"
              aria-controls="navigation"
              aria-label="Show or hide menu"
              hidden
            >
              Menu
            </button>
            <ul id="navigation" className="govuk-header__navigation-list">
              {navigation.map((item) => (
                <li
                  key={item.href}
                  className={`govuk-header__navigation-item ${
                    pathname === item.href ? 'govuk-header__navigation-item--active' : ''
                  }`}
                >
                  <Link href={item.href} className="govuk-header__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
