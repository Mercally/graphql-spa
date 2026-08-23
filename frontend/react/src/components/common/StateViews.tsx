/** Tiny shared placeholders for the three states every list/detail view needs. */
export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <p className="state state-loading">{label}</p>;
}

export function ErrorState({ message }: { message: string }) {
  return <p className="state state-error">Error: {message}</p>;
}

export function EmptyState({ label = 'Nothing here yet.' }: { label?: string }) {
  return <p className="state state-empty">{label}</p>;
}
