import { Link, useParams } from 'react-router-dom';
import { useComment } from '../../hooks/useComments';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function CommentDetailPage() {
  const { id } = useParams();
  const { item, loading, error } = useComment(id);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="Comment not found." />;

  return (
    <section>
      <h2>Comment</h2>
      <p>{item.text}</p>
      <p className="muted">
        On task <Link to={`/tasks/${item.taskId}`}>{item.taskId}</Link>
      </p>
      <p className="muted">
        By <Link to={`/users/${item.userId}`}>{item.userId}</Link>
      </p>
      <p className="muted">Posted {new Date(item.createdAt).toLocaleString()}</p>
    </section>
  );
}
