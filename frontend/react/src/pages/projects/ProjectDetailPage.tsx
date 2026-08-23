import { Link, useParams } from 'react-router-dom';
import { useProject } from '../../hooks/useProjects';
import { useTasksList } from '../../hooks/useTasks';
import { useTeamsList } from '../../hooks/useTeams';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';

export function ProjectDetailPage() {
  const { id } = useParams();
  const { item, loading, error } = useProject(id);
  const { items: tasks } = useTasksList({ projectId: id });
  const { items: teams } = useTeamsList(id);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="Project not found." />;

  return (
    <section>
      <div className="page-header">
        <h2>{item.name}</h2>
        <StatusBadge status={item.status} />
      </div>
      <p>{item.description}</p>
      <p className="muted">
        Customer: <Link to={`/customers/${item.customerId}`}>{item.customerId}</Link>
      </p>

      <h3>Tasks</h3>
      {tasks.length === 0 ? (
        <EmptyState label="No tasks for this project." />
      ) : (
        <ul className="link-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks/${task.id}`}>{task.title}</Link> <StatusBadge status={task.status} />
            </li>
          ))}
        </ul>
      )}

      <h3>Teams</h3>
      {teams.length === 0 ? (
        <EmptyState label="No teams for this project." />
      ) : (
        <ul className="link-list">
          {teams.map((team) => (
            <li key={team.id}>
              <Link to={`/teams/${team.id}`}>{team.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
