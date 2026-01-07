import type { Metadata } from 'next';
import './globals.scss';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Wayfinder - Cross-Government Knowledge Platform',
  description:
    'Discover APIs, patterns, and expertise across government. Find what exists, learn from others, build better services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="govuk-template">
      <head>
        {/* GOV.UK Frontend requires these for proper rendering */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0b0c0c" />
      </head>
      <body className="govuk-template__body js-enabled">
        <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">
          Skip to main content
        </a>

        <Header />

        <div className="govuk-width-container">
          <main className="govuk-main-wrapper" id="main-content" role="main">
            <Providers>{children}</Providers>
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}
