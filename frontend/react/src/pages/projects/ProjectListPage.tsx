import { Link } from 'react-router-dom';
import { useProjectsList } from '../../hooks/useProjects';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';

export function ProjectListPage() {
  const { items, total, loading, error } = useProjectsList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Projects ({total})</h2>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {items.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </td>
                <td>
                  <StatusBadge status={project.status} />
                </td>
                <td>
                  <Link to={`/customers/${project.customerId}`}>{project.customerId}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
