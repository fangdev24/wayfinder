/**
 * Admin Dashboard
 *
 * Overview page with quick stats and recent activity.
 */

import Link from 'next/link';
import { db } from '@/lib/db';
import { services, teams, departments, auditLog } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export default async function AdminDashboard() {
  // Get counts
  const serviceCount = db.select().from(services).all().length;
  const teamCount = db.select().from(teams).all().length;
  const deptCount = db.select().from(departments).all().length;

  // Get recent audit entries
  const recentActivity = db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(5)
    .all();

  return (
    <>
      <h1 className="govuk-heading-xl">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-panel govuk-panel--confirmation"
            style={{ background: '#1d70b8', padding: '15px' }}
          >
            <h2 className="govuk-panel__title" style={{ fontSize: '48px' }}>
              {serviceCount}
            </h2>
            <div className="govuk-panel__body">Services</div>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-panel govuk-panel--confirmation"
            style={{ background: '#00703c', padding: '15px' }}
          >
            <h2 className="govuk-panel__title" style={{ fontSize: '48px' }}>
              {teamCount}
            </h2>
            <div className="govuk-panel__body">Teams</div>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div
            className="govuk-panel govuk-panel--confirmation"
            style={{ background: '#912b88', padding: '15px' }}
          >
            <h2 className="govuk-panel__title" style={{ fontSize: '48px' }}>
              {deptCount}
            </h2>
            <div className="govuk-panel__body">Departments</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="govuk-heading-l govuk-!-margin-top-6">Quick actions</h2>
      <ul className="govuk-list">
        <li>
          <Link href="/admin/services/new" className="govuk-link govuk-link--no-visited-state">
            Add a new service
          </Link>
        </li>
        <li>
          <Link href="/admin/teams/new" className="govuk-link govuk-link--no-visited-state">
            Add a new team
          </Link>
        </li>
        <li>
          <Link href="/admin/services" className="govuk-link govuk-link--no-visited-state">
            View all services
          </Link>
        </li>
        <li>
          <Link href="/admin/teams" className="govuk-link govuk-link--no-visited-state">
            View all teams
          </Link>
        </li>
      </ul>

      {/* Recent activity */}
      <h2 className="govuk-heading-l govuk-!-margin-top-6">Recent activity</h2>
      {recentActivity.length > 0 ? (
        <table className="govuk-table">
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th scope="col" className="govuk-table__header">
                Action
              </th>
              <th scope="col" className="govuk-table__header">
                Entity
              </th>
              <th scope="col" className="govuk-table__header">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {recentActivity.map((entry) => (
              <tr key={entry.id} className="govuk-table__row">
                <td className="govuk-table__cell">
                  <strong className="govuk-tag govuk-tag--grey">{entry.action}</strong>
                </td>
                <td className="govuk-table__cell">
                  {entry.entityType}: {entry.entityId}
                </td>
                <td className="govuk-table__cell">
                  {entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString('en-GB')
                    : 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="govuk-body govuk-hint">No recent activity to display.</p>
      )}
    </>
  );
}
