import { Link } from 'react-router-dom';
import { useUsersList } from '../../hooks/useUsers';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function UserListPage() {
  const { items, total, loading, error } = useUsersList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Users ({total})</h2>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
