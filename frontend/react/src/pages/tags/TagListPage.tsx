import { Link } from 'react-router-dom';
import { useTagsList } from '../../hooks/useTags';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function TagListPage() {
  const { items, total, loading, error } = useTagsList();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <h2>Tags ({total})</h2>
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="tag-grid">
          {items.map((tag) => (
            <li key={tag.id}>
              <Link to={`/tags/${tag.id}`} className="tag-chip" style={{ borderColor: tag.color, color: tag.color }}>
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
