import { Link } from 'react-router-dom';
import { useCommentsList } from '../../hooks/useComments';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function CommentListPage() {
  const { items, total, loading, error } = useCommentsList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Comments ({total})</h2>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="link-list">
          {items.map((comment) => (
            <li key={comment.id}>
              <Link to={`/comments/${comment.id}`}>{comment.text.slice(0, 80)}</Link>{' '}
              <span className="muted">on task {comment.taskId}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
