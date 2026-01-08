'use client';

/**
 * Service Form Component
 *
 * Reusable form for creating and editing services.
 * Uses GOV.UK Design System form patterns.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SERVICE_TYPES, SERVICE_STATUSES, AUTH_TYPES } from '@/lib/db/schema';

interface Team {
  id: string;
  name: string;
  departmentId: string;
}

interface Department {
  id: string;
  name: string;
  acronym: string;
}

interface ServiceFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    name: string;
    type: string;
    departmentId: string;
    teamId: string;
    description: string;
    documentation: string;
    endpoint?: string | null;
    version?: string | null;
    status: string;
    lastUpdated: string;
    monthlyRequests?: string | null;
    uptime?: string | null;
    authentication: string[];
    tags: string[];
  };
  teams: Team[];
  departments: Department[];
}

export function ServiceForm({ mode, initialData, teams, departments }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    type: initialData?.type || 'api',
    departmentId: initialData?.departmentId || '',
    teamId: initialData?.teamId || '',
    description: initialData?.description || '',
    documentation: initialData?.documentation || '',
    endpoint: initialData?.endpoint || '',
    version: initialData?.version || '',
    status: initialData?.status || 'alpha',
    lastUpdated: initialData?.lastUpdated || new Date().toISOString().split('T')[0],
    monthlyRequests: initialData?.monthlyRequests || '',
    uptime: initialData?.uptime || '',
    authentication: initialData?.authentication || [],
    tags: initialData?.tags?.join(', ') || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthChange = (authType: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      authentication: checked
        ? [...prev.authentication, authType]
        : prev.authentication.filter((a) => a !== authType),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        endpoint: formData.endpoint || undefined,
        version: formData.version || undefined,
        monthlyRequests: formData.monthlyRequests || undefined,
        uptime: formData.uptime || undefined,
      };

      const url =
        mode === 'create'
          ? '/api/admin/services'
          : `/api/admin/services/${formData.id}`;

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to save service');
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      router.push(`/admin/services/${data.service.id}`);
      router.refresh();
    } catch {
      setError('An error occurred while saving');
      setIsSubmitting(false);
    }
  };

  // Filter teams by selected department
  const filteredTeams = formData.departmentId
    ? teams.filter((t) => t.departmentId === formData.departmentId)
    : teams;

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
            Service ID
          </label>
          <div className="govuk-hint">
            A unique identifier (lowercase, hyphens only). Example: citizen-eligibility-api
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
          Service name
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

      {/* Type */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="type">
          Service type
        </label>
        <select
          className="govuk-select"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          {SERVICE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
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

      {/* Team */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="teamId">
          Owning team
        </label>
        <select
          className="govuk-select"
          id="teamId"
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          required
        >
          <option value="">Select a team</option>
          {filteredTeams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="description">
          Description
        </label>
        <div className="govuk-hint">Describe what this service does</div>
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

      {/* Documentation URL */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="documentation">
          Documentation URL
        </label>
        <input
          className="govuk-input"
          id="documentation"
          name="documentation"
          type="url"
          value={formData.documentation}
          onChange={handleChange}
          required
        />
      </div>

      {/* Endpoint */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="endpoint">
          API endpoint (optional)
        </label>
        <input
          className="govuk-input"
          id="endpoint"
          name="endpoint"
          type="url"
          value={formData.endpoint}
          onChange={handleChange}
        />
      </div>

      {/* Version */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="version">
          Version (optional)
        </label>
        <input
          className="govuk-input govuk-input--width-10"
          id="version"
          name="version"
          type="text"
          value={formData.version}
          onChange={handleChange}
          placeholder="e.g., 2.1.0"
        />
      </div>

      {/* Status */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="status">
          Status
        </label>
        <select
          className="govuk-select"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          {SERVICE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Authentication */}
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            Authentication methods
          </legend>
          <div className="govuk-checkboxes govuk-checkboxes--small">
            {AUTH_TYPES.map((authType) => (
              <div className="govuk-checkboxes__item" key={authType}>
                <input
                  className="govuk-checkboxes__input"
                  id={`auth-${authType}`}
                  name={`auth-${authType}`}
                  type="checkbox"
                  checked={formData.authentication.includes(authType)}
                  onChange={(e) => handleAuthChange(authType, e.target.checked)}
                />
                <label className="govuk-label govuk-checkboxes__label" htmlFor={`auth-${authType}`}>
                  {authType}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Tags */}
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="tags">
          Tags
        </label>
        <div className="govuk-hint">Comma-separated list of tags</div>
        <input
          className="govuk-input"
          id="tags"
          name="tags"
          type="text"
          value={formData.tags}
          onChange={handleChange}
          placeholder="api, payments, shared-platform"
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
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create service' : 'Save changes'}
        </button>
        <a href="/admin/services" className="govuk-link">
          Cancel
        </a>
      </div>
    </form>
  );
}
