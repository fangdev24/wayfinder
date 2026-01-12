'use client';

/**
 * Decision Framework Component
 *
 * Presents stakeholders with binary choices and their consequences,
 * making the decision explicit and documented.
 */

import { DECISION_QUESTIONS } from '@/lib/govuk-api';
import type { DecisionQuestion } from '@/lib/govuk-api';

function DecisionCard({ question }: { question: DecisionQuestion }) {
  return (
    <div
      className="govuk-!-margin-bottom-6 govuk-!-padding-4"
      style={{ background: '#f3f2f1', border: '1px solid #b1b4b6' }}
    >
      <h3 className="govuk-heading-m govuk-!-margin-bottom-2">{question.question}</h3>
      <p className="govuk-body-s" style={{ color: '#505a5f' }}>
        {question.context}
      </p>

      <div className="govuk-grid-row govuk-!-margin-top-4">
        {/* Yes Option */}
        <div className="govuk-grid-column-one-half">
          <div
            className="govuk-!-padding-3"
            style={{
              background: '#ffffff',
              borderLeft: '4px solid #00703c',
              height: '100%',
            }}
          >
            <h4 className="govuk-heading-s" style={{ color: '#00703c' }}>
              ✓ {question.yesOption.title}
            </h4>

            <p className="govuk-body-s govuk-!-font-weight-bold">Requires:</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              {question.yesOption.requires.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>

            <p className="govuk-body-s govuk-!-font-weight-bold">Enables:</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              {question.yesOption.enables.map((en) => (
                <li key={en} style={{ color: '#00703c' }}>
                  {en}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* No Option */}
        <div className="govuk-grid-column-one-half">
          <div
            className="govuk-!-padding-3"
            style={{
              background: '#ffffff',
              borderLeft: '4px solid #505a5f',
              height: '100%',
            }}
          >
            <h4 className="govuk-heading-s" style={{ color: '#505a5f' }}>
              ✗ {question.noOption.title}
            </h4>

            <p className="govuk-body-s govuk-!-font-weight-bold">Continues:</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              {question.noOption.continues.map((cont) => (
                <li key={cont}>{cont}</li>
              ))}
            </ul>

            <p className="govuk-body-s govuk-!-font-weight-bold">Accepts:</p>
            <ul className="govuk-list govuk-list--bullet govuk-body-s">
              {question.noOption.accepts.map((acc) => (
                <li key={acc} style={{ color: '#505a5f' }}>
                  {acc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DecisionFramework() {
  return (
    <div className="govuk-!-margin-bottom-8">
      <h2 className="govuk-heading-l">Decision Framework</h2>

      <p className="govuk-body">
        These capabilities require architectural decisions. The questions below clarify
        what each path enables and forecloses. The decision is yours.
      </p>

      <div
        className="govuk-inset-text govuk-!-margin-bottom-6"
        style={{ borderColor: '#1d70b8' }}
      >
        <strong>Note:</strong> These are not recommendations — they are choices with
        trade-offs. Each option has legitimate reasons for selection depending on
        priorities, resources, and constraints.
      </div>

      {DECISION_QUESTIONS.map((q) => (
        <DecisionCard key={q.id} question={q} />
      ))}

      {/* Summary */}
      <div
        className="govuk-!-padding-4 govuk-!-margin-top-6"
        style={{
          background: '#f3f2f1',
          border: '2px solid #0b0c0c',
        }}
      >
        <h3 className="govuk-heading-m">Summary of Choices</h3>
        <p className="govuk-body">
          The decisions above are independent but complementary. Adopting Solid Pods
          (Question 3) provides the foundation that makes Questions 1 and 2 easier to achieve.
        </p>
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">
                Decision
              </th>
              <th scope="col" className="govuk-table__header">
                Primary Benefit
              </th>
              <th scope="col" className="govuk-table__header">
                Primary Cost
              </th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Agent access</td>
              <td className="govuk-table__cell">Developers get instant answers</td>
              <td className="govuk-table__cell">Structured data investment</td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Governance visibility</td>
              <td className="govuk-table__cell">Compliance becomes auditable</td>
              <td className="govuk-table__cell">Policy mapping effort</td>
            </tr>
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">Federated data</td>
              <td className="govuk-table__cell">Department autonomy</td>
              <td className="govuk-table__cell">Infrastructure investment</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
