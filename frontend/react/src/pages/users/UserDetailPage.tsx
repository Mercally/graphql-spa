import { useParams } from 'react-router-dom';
import { useUser } from '../../hooks/useUsers';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function UserDetailPage() {
  const { id } = useParams();
  const { item, loading, error } = useUser(id);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="User not found." />;

  return (
    <section>
      <h2>{item.name}</h2>
      <p>{item.email}</p>
      <p className="muted">Role: {item.role}</p>
      <p className="muted">Created {new Date(item.createdAt).toLocaleString()}</p>
    </section>
  );
}
