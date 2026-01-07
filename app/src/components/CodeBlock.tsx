'use client';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  return (
    <div className="govuk-!-margin-bottom-4">
      {title && (
        <p className="govuk-body-s govuk-!-margin-bottom-1">
          <strong>{title}</strong>
        </p>
      )}
      <pre
        style={{
          background: '#f3f2f1',
          padding: '16px',
          overflow: 'auto',
          border: '1px solid #b1b4b6',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  );
}
