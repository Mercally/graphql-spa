import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCustomer } from '../../hooks/useCustomers';
import { useCustomerMutations } from '../../hooks/useCustomerMutations';
import { useProjectsList } from '../../hooks/useProjects';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useCustomer(id);
  const { items: projects } = useProjectsList(id);
  const { remove } = useCustomerMutations();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="Customer not found." />;

  async function handleDelete() {
    if (!id || !window.confirm('Delete this customer?')) return;
    await remove(id);
    navigate('/customers');
  }

  return (
    <section>
      <div className="page-header">
        <h2>{item.name}</h2>
        <div className="actions">
          <Link to={`/customers/${id}/edit`} className="btn">
            Edit
          </Link>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <p>{item.email}</p>
      <p className="muted">Created {new Date(item.createdAt).toLocaleString()}</p>

      <h3>Projects</h3>
      {projects.length === 0 ? (
        <EmptyState label="No projects for this customer." />
      ) : (
        <ul className="link-list">
          {projects.map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link> <StatusBadge status={project.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
