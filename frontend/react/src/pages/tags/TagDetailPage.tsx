import { useParams } from 'react-router-dom';
import { useTag } from '../../hooks/useTags';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/StateViews';

export function TagDetailPage() {
  const { id } = useParams();
  const { item, loading, error } = useTag(id);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <EmptyState label="Tag not found." />;

  return (
    <section>
      <h2>
        <span className="tag-swatch" style={{ background: item.color }} /> {item.name}
      </h2>
      <p className="muted">Color: {item.color}</p>
      <p className="muted">Created {new Date(item.createdAt).toLocaleString()}</p>
    </section>
  );
}
