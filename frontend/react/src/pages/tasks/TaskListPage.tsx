import { Link, useSearchParams } from 'react-router-dom';
import { useTasksList } from '../../hooks/useTasks';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TASK_STATUSES, type TaskStatus } from '../../types/entities';

export function TaskListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get('status') as TaskStatus | null) ?? undefined;

  const { items, total, loading, error } = useTasksList({ status });

  return (
    <section>
      <div className="page-header">
        <h2>Tasks ({total})</h2>
        <Link to="/tasks/new" className="btn">
          + New Task
        </Link>
      </div>

      <div className="filter-bar">
        <button
          type="button"
          className={!status ? 'segmented-btn active' : 'segmented-btn'}
          onClick={() => setSearchParams({})}
        >
          All
        </button>
        {TASK_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={status === s ? 'segmented-btn active' : 'segmented-btn'}
            onClick={() => setSearchParams({ status: s })}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && items.length === 0 && <EmptyState />}
      {!loading && !error && items.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Project</th>
            </tr>
          </thead>
          <tbody>
            {items.map((task) => (
              <tr key={task.id}>
                <td>
                  <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <Link to={`/projects/${task.projectId}`}>{task.projectId}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
