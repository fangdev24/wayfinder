'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

type FeedbackType = 'bug' | 'feature' | 'general';

interface FeedbackFormProps {
  onClose: () => void;
}

export function FeedbackForm({ onClose }: FeedbackFormProps) {
  const pathname = usePathname();
  const [type, setType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setErrorMessage('Please enter your feedback');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          message: message.trim(),
          email: email.trim() || undefined,
          page: pathname,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setStatus('error');
      setErrorMessage('Failed to submit feedback. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="wayfinder-feedback-panel">
        <div className="govuk-panel govuk-panel--confirmation">
          <h2 className="govuk-panel__title">Thank you</h2>
          <div className="govuk-panel__body">
            Your feedback has been submitted
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wayfinder-feedback-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <h2 className="govuk-heading-m govuk-!-margin-bottom-4">Send feedback</h2>
        <button
          type="button"
          onClick={onClose}
          className="govuk-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
          aria-label="Close feedback form"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Feedback Type */}
        <div className="govuk-form-group">
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Type of feedback
            </legend>
            <div className="govuk-radios govuk-radios--small govuk-radios--inline">
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="feedback-general"
                  name="feedback-type"
                  type="radio"
                  value="general"
                  checked={type === 'general'}
                  onChange={() => setType('general')}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="feedback-general">
                  General
                </label>
              </div>
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="feedback-bug"
                  name="feedback-type"
                  type="radio"
                  value="bug"
                  checked={type === 'bug'}
                  onChange={() => setType('bug')}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="feedback-bug">
                  Bug
                </label>
              </div>
              <div className="govuk-radios__item">
                <input
                  className="govuk-radios__input"
                  id="feedback-feature"
                  name="feedback-type"
                  type="radio"
                  value="feature"
                  checked={type === 'feature'}
                  onChange={() => setType('feature')}
                />
                <label className="govuk-label govuk-radios__label" htmlFor="feedback-feature">
                  Feature idea
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        {/* Message */}
        <div className={`govuk-form-group ${errorMessage ? 'govuk-form-group--error' : ''}`}>
          <label className="govuk-label" htmlFor="feedback-message">
            Your feedback
          </label>
          {errorMessage && (
            <p className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {errorMessage}
            </p>
          )}
          <textarea
            className={`govuk-textarea ${errorMessage ? 'govuk-textarea--error' : ''}`}
            id="feedback-message"
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-describedby={errorMessage ? 'feedback-error' : undefined}
          />
        </div>

        {/* Email (optional) */}
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="feedback-email">
            Email (optional)
          </label>
          <p className="govuk-hint" style={{ fontSize: '14px' }}>
            If you would like us to follow up
          </p>
          <input
            className="govuk-input govuk-input--width-20"
            id="feedback-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="govuk-button"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending...' : 'Send feedback'}
        </button>
      </form>

      <p className="govuk-body-s govuk-!-margin-top-4" style={{ color: '#505a5f' }}>
        Feedback is sent to the Wayfinder team via Slack.
      </p>
    </div>
  );
}

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="govuk-footer__link"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          font: 'inherit',
          padding: 0,
        }}
      >
        Send feedback
      </button>

      {isOpen && (
        <div
          className="wayfinder-feedback-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <FeedbackForm onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}
