/**
 * Small React-only async-mutation state wrapper (loading/error/data + a
 * mutate() trigger), independent of both TanStack Query and Apollo. Used to
 * drive GraphQL mutations whose document text is only known at call time
 * (see api/graphql/mutationBuilder.ts) without pulling TanStack Query into
 * the GraphQL layer or Apollo into the REST layer.
 */
import { useCallback, useState } from 'react';

interface AsyncMutationState<TResult> {
  loading: boolean;
  error: Error | null;
  data: TResult | null;
}

export function useAsyncMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) {
  const [state, setState] = useState<AsyncMutationState<TResult>>({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(
    async (...args: TArgs): Promise<TResult> => {
      setState({ loading: true, error: null, data: null });
      try {
        const data = await fn(...args);
        setState({ loading: false, error: null, data });
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setState({ loading: false, error, data: null });
        throw error;
      }
    },
    [fn]
  );

  return { mutate, ...state };
}
