'use client';

/**
 * Team Form Component
 *
 * Reusable form for creating and editing teams.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Department {
  id: string;
  name: string;
  acronym: string;
}

interface TeamFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    name: string;
    departmentId: string;
    description: string;
    contact: string;
    slack: string;
    responsibilities: string[];
  };
  departments: Department[];
}

export function TeamForm({ mode, initialData, departments }: TeamFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    departmentId: initialData?.departmentId || '',
    description: initialData?.description || '',
    contact: initialData?.contact || '',
    slack: initialData?.slack || '',
    responsibilities: initialData?.responsibilities?.join('\n') || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities
          .split('\n')
          .map((r) => r.trim())
          .filter(Boolean),
      };

      const url =
        mode === 'create'
          ? '/api/admin/teams'
          : `/api/admin/teams/${formData.id}`;

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save team');
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      router.push(`/admin/teams/${data.team.id}`);
      router.refresh();
    } catch {
      setError('An error occurred while saving');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="govuk-error-summary" role="alert" aria-labelledby="error-summary-title">
          <h2 className="govuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-error-summary__list">
              <li>{error}</li>
            </ul>
          </div>
        </div>
      )}

      {/* ID (only for create) */}
      {mode === 'create' && (
        <div className="govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="id">
            Team ID
          </label>
          <div className="govuk-hint">
            A unique identifier (lowercase, hyphens only). Example: puffin-delivery
          </div>
          <input
            className="govuk-input govuk-input--width-20"
            id="id"
            name="id"
            type="text"
            value={formData.id}
            onChange={handleChange}
            pattern="[a-z0-9-]+"
            required
          />
        </div>
      )}

      {/* Name */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="name">
          Team name
        </label>
        <input
          className="govuk-input"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Department */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="departmentId">
          Department
        </label>
        <select
          className="govuk-select"
          id="departmentId"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name} ({dept.acronym})
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="description">
          Description
        </label>
        <div className="govuk-hint">Describe what this team does</div>
        <textarea
          className="govuk-textarea"
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Contact email */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="contact">
          Contact email
        </label>
        <input
          className="govuk-input"
          id="contact"
          name="contact"
          type="email"
          value={formData.contact}
          onChange={handleChange}
          required
        />
      </div>

      {/* Slack channel */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="slack">
          Slack channel
        </label>
        <input
          className="govuk-input govuk-input--width-20"
          id="slack"
          name="slack"
          type="text"
          value={formData.slack}
          onChange={handleChange}
          placeholder="#team-support"
          required
        />
      </div>

      {/* Responsibilities */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="responsibilities">
          Responsibilities
        </label>
        <div className="govuk-hint">One responsibility per line</div>
        <textarea
          className="govuk-textarea"
          id="responsibilities"
          name="responsibilities"
          rows={5}
          value={formData.responsibilities}
          onChange={handleChange}
          placeholder="API Gateway management&#10;Service mesh configuration&#10;Infrastructure standards"
        />
      </div>

      {/* Submit buttons */}
      <div className="govuk-button-group">
        <button
          type="submit"
          className="govuk-button"
          data-module="govuk-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create team' : 'Save changes'}
        </button>
        <a href="/admin/teams" className="govuk-link">
          Cancel
        </a>
      </div>
    </form>
  );
}
