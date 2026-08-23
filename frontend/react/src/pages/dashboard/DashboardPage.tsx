import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../config/SettingsContext';
import { useCustomerDashboard } from '../../hooks/useDashboard';
import { getMetaRestClient } from '../../api/rest/client';
import { clearRequestLog } from '../../lib/requestLog';
import { RequestLogPanel } from '../../components/layout/RequestLogPanel';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';
import type { Customer } from '../../types/entities';

/**
 * The core PoC demo (Requirements.md section 4/10/19): pick a customer, then
 * render Customer -> Projects -> Tasks (AssignedUser/Tags/Comments) and
 * Projects -> Teams -> Users in one screen, next to a live count of how many
 * HTTP requests it took to build it - 1 for GraphQL, many for REST.
 */
export function DashboardPage() {
  const { backend, mode } = useSettings();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState<string>('');

  // Populate the picker via the unlogged meta client (REST) or the normal
  // GraphQL hook - neither counts toward the dashboard's own request tally.
  useEffect(() => {
    let cancelled = false;
    getMetaRestClient(backend)
      .get<{ items: Customer[] } | Customer[]>('/customers', { params: { limit: 20 } })
      .then((res) => {
        if (cancelled) return;
        const items = Array.isArray(res.data) ? res.data : res.data.items;
        setCustomers(items);
        setCustomerId((current) => current || items[0]?.id || '');
      })
      .catch(() => {
        /* picker population failure surfaces via the dashboard's own error state */
      });
    return () => {
      cancelled = true;
    };
  }, [backend]);

  // Reset the request-count log synchronously, during render, the moment the
  // customer/mode/backend actually changes - before the data hooks below (or
  // their internal effects) have a chance to fetch and log anything for the
  // new selection. Comparing against a ref during render (not in an effect)
  // is what guarantees this runs first.
  const depsKey = `${backend}:${mode}:${customerId}`;
  const prevDepsKey = useRef<string | undefined>(undefined);
  if (customerId && prevDepsKey.current !== depsKey) {
    prevDepsKey.current = depsKey;
    clearRequestLog();
  }

  const { customer, loading, error } = useCustomerDashboard(customerId || undefined);

  return (
    <section>
      <h2>Dashboard</h2>
      <p className="muted">
        Customer &rarr; Projects &rarr; Tasks (Assigned User / Tags / Comments) and Projects &rarr; Teams &rarr; Users,
        in one screen. Switch REST/GraphQL in the header to compare request counts for the exact same view.
      </p>

      <label className="form-field">
        <span>Customer</span>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <RequestLogPanel />

      {loading && <LoadingState label="Loading dashboard..." />}
      {error && <ErrorState message={error} />}
      {!loading && !error && !customer && <EmptyState label="Select a customer." />}

      {!loading && !error && customer && (
        <>
          <h3>{customer.name}</h3>
          {customer.projects.length === 0 && <EmptyState label="This customer has no projects yet." />}
          {customer.projects.map((project) => (
            <div className="card" key={project.id}>
              <div className="page-header">
                <h4>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </h4>
                <StatusBadge status={project.status} />
              </div>

              <div className="dashboard-grid">
                <div>
                  <h5>Teams</h5>
                  {project.teams.length === 0 && <p className="muted">No teams.</p>}
                  {project.teams.map((team) => (
                    <div className="tree-node" key={team.id}>
                      <strong>
                        <Link to={`/teams/${team.id}`}>{team.name}</Link>
                      </strong>
                      <div className="pill-row">
                        {team.users.length === 0 && <span className="muted">No members</span>}
                        {team.users.map((u) => (
                          <Link key={u.id} className="badge" to={`/users/${u.id}`}>
                            {u.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h5>Tasks</h5>
                  {project.tasks.length === 0 && <p className="muted">No tasks.</p>}
                  <ul className="tree">
                    {project.tasks.map((task) => (
                      <li className="tree-node" key={task.id}>
                        <div className="page-header" style={{ marginBottom: '0.35rem' }}>
                          <Link to={`/tasks/${task.id}`}>
                            <strong>{task.title}</strong>
                          </Link>
                          <StatusBadge status={task.status} />
                        </div>
                        <p className="muted" style={{ margin: '0 0 0.35rem' }}>
                          Assigned to{' '}
                          {task.assignedUser ? (
                            <Link to={`/users/${task.assignedUser.id}`}>{task.assignedUser.name}</Link>
                          ) : (
                            'nobody'
                          )}
                        </p>
                        <div className="pill-row">
                          {task.tags.map((tag) => (
                            <span className="badge" key={tag.id}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                        <p className="muted" style={{ margin: '0.35rem 0 0' }}>
                          {task.comments.length} comment(s)
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
