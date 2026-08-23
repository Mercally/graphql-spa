import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTask, useTaskMutations } from '../../hooks/useTasks';
import { useUser } from '../../hooks/useUsers';
import { useTagsList } from '../../hooks/useTags';
import { useCommentsList } from '../../hooks/useComments';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';

export function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error } = useTask(id);
  const { item: assignedUser } = useUser(item?.assignedUserId ?? undefined);
  const { items: allTags } = useTagsList(1, 500);
  const { items: comments } = useCommentsList(id);
  const { remove } = useTaskMutations();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="Task not found." />;

  const taskTags = allTags.filter((tag) => item.tagIds.includes(tag.id));

  async function handleDelete() {
    if (!id || !window.confirm('Delete this task?')) return;
    await remove(id);
    navigate('/tasks');
  }

  return (
    <section>
      <div className="page-header">
        <h2>{item.title}</h2>
        <div className="actions">
          <StatusBadge status={item.status} />
          <Link to={`/tasks/${id}/edit`} className="btn">
            Edit
          </Link>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <p>{item.description}</p>
      <p className="muted">
        Project: <Link to={`/projects/${item.projectId}`}>{item.projectId}</Link>
      </p>
      <p className="muted">Assigned to: {assignedUser ? assignedUser.name : 'Unassigned'}</p>

      <h3>Tags</h3>
      {taskTags.length === 0 ? (
        <EmptyState label="No tags." />
      ) : (
        <ul className="tag-grid">
          {taskTags.map((tag) => (
            <li key={tag.id}>
              <span className="tag-chip" style={{ borderColor: tag.color, color: tag.color }}>
                {tag.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h3>Comments</h3>
      {comments.length === 0 ? (
        <EmptyState label="No comments." />
      ) : (
        <ul className="link-list">
          {comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
