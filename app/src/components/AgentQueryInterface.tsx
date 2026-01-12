'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { processQuery, type QueryResult, type QueryEntity } from '@/lib/agent-query';

/**
 * AgentQueryInterface - Natural language query interface
 *
 * This component provides a chat-like interface for querying the Wayfinder
 * knowledge base using natural language. It's designed to mirror the
 * experience of asking a Slack bot.
 */

/**
 * Safe text renderer that handles *bold* and _italic_ markers
 * without using dangerouslySetInnerHTML
 */
function FormattedText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let keyCounter = 0;

  // Split text into lines first
  const lines = text.split('\n');

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      parts.push(<br key={`br-${lineIndex}`} />);
    }

    // Simple parser: split by markers and track state
    let i = 0;
    let buffer = '';

    while (i < line.length) {
      // Check for bold marker *
      if (line[i] === '*') {
        // Push any buffered text
        if (buffer) {
          parts.push(buffer);
          buffer = '';
        }
        // Find closing *
        const closeIdx = line.indexOf('*', i + 1);
        if (closeIdx > i + 1) {
          const content = line.slice(i + 1, closeIdx);
          parts.push(<strong key={`b-${keyCounter++}`}>{content}</strong>);
          i = closeIdx + 1;
          continue;
        }
      }

      // Check for italic marker _
      if (line[i] === '_') {
        // Push any buffered text
        if (buffer) {
          parts.push(buffer);
          buffer = '';
        }
        // Find closing _
        const closeIdx = line.indexOf('_', i + 1);
        if (closeIdx > i + 1) {
          const content = line.slice(i + 1, closeIdx);
          parts.push(<em key={`i-${keyCounter++}`}>{content}</em>);
          i = closeIdx + 1;
          continue;
        }
      }

      buffer += line[i];
      i++;
    }

    // Push remaining buffer
    if (buffer) {
      parts.push(buffer);
    }
  });

  return <>{parts}</>;
}

export function AgentQueryInterface() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Array<{
    type: 'user' | 'agent';
    content: string;
    result?: QueryResult;
    timestamp: Date;
  }>>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat container (not the page) when history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    const userQuery = query.trim();
    setQuery('');
    setIsProcessing(true);

    setHistory(prev => [...prev, {
      type: 'user',
      content: userQuery,
      timestamp: new Date(),
    }]);

    setTimeout(() => {
      const result = processQuery(userQuery);

      setHistory(prev => [...prev, {
        type: 'agent',
        content: result.response,
        result,
        timestamp: new Date(),
      }]);

      setIsProcessing(false);
    }, 300);
  }, [query, isProcessing]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  }, []);

  const renderEntity = (entity: QueryEntity) => {
    const icons: Record<string, string> = {
      service: '🔧',
      person: '👤',
      team: '👥',
      pattern: '📋',
      department: '🏛️',
    };

    return (
      <Link
        key={entity.id}
        href={entity.url}
        className="govuk-link govuk-link--no-visited-state"
        style={{
          display: 'inline-block',
          marginRight: '12px',
          marginBottom: '4px',
          fontSize: '14px',
        }}
      >
        {icons[entity.type] || '📄'} {entity.name}
      </Link>
    );
  };

  const exampleQueries = [
    'Who runs the API for revenue and tax',
    'What agents handle correspondence',
    'List services in citizen support',
    'What team maintains identity verification',
  ];

  return (
    <div className="govuk-!-margin-bottom-6">
      <div className="govuk-!-margin-bottom-4">
        <h2 className="govuk-heading-m">Ask Wayfinder</h2>
        <p className="govuk-body-s govuk-!-margin-bottom-2">
          Ask questions in plain English, like you would in Slack.
        </p>
      </div>

      <div
        ref={chatContainerRef}
        style={{
          border: '1px solid #b1b4b6',
          borderRadius: '0',
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'auto',
          background: '#f3f2f1',
          marginBottom: '16px',
        }}
      >
        {history.length === 0 ? (
          <div className="govuk-!-padding-4" style={{ color: '#505a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
            <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ textAlign: 'center' }}>
              Use the example questions below, or type your own.
            </p>
          </div>
        ) : (
          <div className="govuk-!-padding-3">
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: item.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: item.type === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    background: item.type === 'user' ? '#1d70b8' : '#ffffff',
                    color: item.type === 'user' ? '#ffffff' : '#0b0c0c',
                    border: item.type === 'agent' ? '1px solid #b1b4b6' : 'none',
                  }}
                >
                  {item.type === 'agent' ? (
                    <>
                      <div className="govuk-body-s govuk-!-margin-bottom-0">
                        <FormattedText text={item.content} />
                      </div>

                      {item.result?.entities && item.result.entities.length > 0 && (
                        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f3f2f1' }}>
                          {item.result.entities.map(renderEntity)}
                        </div>
                      )}

                      {item.result?.suggestions && item.result.suggestions.length > 0 && (
                        <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f3f2f1' }}>
                          <span className="govuk-body-s" style={{ color: '#505a5f' }}>Try asking: </span>
                          {item.result.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              type="button"
                              className="govuk-link"
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '14px',
                                marginRight: '12px',
                              }}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="govuk-body-s govuk-!-margin-bottom-0">{item.content}</span>
                  )}
                </div>

                <span
                  className="govuk-body-s"
                  style={{
                    color: '#505a5f',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}
                >
                  {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isProcessing && (
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '12px 16px',
                    borderRadius: '12px 12px 12px 0',
                    background: '#ffffff',
                    border: '1px solid #b1b4b6',
                  }}
                >
                  <span className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>
                    Searching...
                  </span>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="govuk-form-group govuk-!-margin-bottom-0">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              className="govuk-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              disabled={isProcessing}
              style={{ flex: 1 }}
              aria-label="Query input"
            />
            <button
              type="submit"
              className="govuk-button govuk-!-margin-bottom-0"
              disabled={isProcessing || !query.trim()}
            >
              Ask
            </button>
          </div>
        </div>
      </form>

      {/* Example Questions */}
      <div className="govuk-!-margin-top-3 govuk-!-margin-bottom-4">
        <p className="govuk-body-s govuk-!-margin-bottom-2" style={{ color: '#505a5f' }}>
          <strong>Try asking:</strong>
        </p>
        <ul className="govuk-list govuk-body-s" style={{ marginBottom: 0 }}>
          {exampleQueries.map((q, i) => (
            <li key={i}>
              <button
                type="button"
                className="govuk-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => handleSuggestionClick(q)}
              >
                {q}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="govuk-inset-text govuk-!-margin-top-0">
        <p className="govuk-body-s govuk-!-margin-bottom-0">
          <strong>Also available in Slack:</strong> Message <code>@wayfinder</code> in any channel
          or use <code>/wayfinder</code> commands for quick lookups.
        </p>
        <p className="govuk-body-s govuk-!-margin-bottom-0 govuk-!-margin-top-2" style={{ color: '#505a5f' }}>
          <em>Note: The Slack bot is only available in the internal demo workspace.</em>
        </p>
      </div>
    </div>
  );
}
