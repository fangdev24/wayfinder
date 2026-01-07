'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} role="search">
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--m" htmlFor="search">
          What are you looking for?
        </label>
        <div id="search-hint" className="govuk-hint">
          Search for APIs, patterns, services, or ask a question like
          &ldquo;How do I verify identity?&rdquo;
        </div>
        <div className="govuk-input__wrapper">
          <input
            className="govuk-input"
            id="search"
            name="search"
            type="search"
            aria-describedby="search-hint"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., income verification API"
          />
          <button
            type="submit"
            className="govuk-button govuk-!-margin-bottom-0 govuk-!-margin-left-2"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
