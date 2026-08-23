import { Link } from 'react-router-dom';
import { useTeamsList } from '../../hooks/useTeams';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function TeamListPage() {
  const { items, total, loading, error } = useTeamsList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Teams ({total})</h2>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Project</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {items.map((team) => (
              <tr key={team.id}>
                <td>
                  <Link to={`/teams/${team.id}`}>{team.name}</Link>
                </td>
                <td>
                  <Link to={`/projects/${team.projectId}`}>{team.projectId}</Link>
                </td>
                <td>{team.memberUserIds.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
