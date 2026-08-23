import { Link, useParams } from 'react-router-dom';
import { useTeam } from '../../hooks/useTeams';
import { useUsersList } from '../../hooks/useUsers';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function TeamDetailPage() {
  const { id } = useParams();
  const { item, loading, error } = useTeam(id);
  const { items: users } = useUsersList(1, 500);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="Team not found." />;

  const members = users.filter((user) => item.memberUserIds.includes(user.id));

  return (
    <section>
      <h2>{item.name}</h2>
      <p className="muted">
        Project: <Link to={`/projects/${item.projectId}`}>{item.projectId}</Link>
      </p>

      <h3>Members</h3>
      {members.length === 0 ? (
        <EmptyState label="No members loaded yet." />
      ) : (
        <ul className="link-list">
          {members.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>{user.name}</Link> <span className="muted">({user.role})</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
