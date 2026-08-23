import { useSettings } from '../config/SettingsContext';
import { customersResource } from '../api/rest/resources';
import { createCustomer, updateCustomer, deleteCustomer } from '../api/graphql/customers';
import { useAsyncMutation } from './useAsyncMutation';

export function useCustomerMutations() {
  const { backend, mode } = useSettings();
  const restCreate = customersResource.useCreate(backend);
  const restUpdate = customersResource.useUpdate(backend);
  const restRemove = customersResource.useRemove(backend);
  const graphqlCreate = useAsyncMutation((name: string, email: string) => createCustomer(backend, name, email));
  const graphqlUpdate = useAsyncMutation((id: string, name: string, email: string) =>
    updateCustomer(backend, id, name, email)
  );
  const graphqlRemove = useAsyncMutation((id: string) => deleteCustomer(backend, id));

  if (mode === 'rest') {
    return {
      create: (name: string, email: string) => restCreate.mutateAsync({ name, email }),
      update: (id: string, name: string, email: string) => restUpdate.mutateAsync({ id, payload: { name, email } }),
      remove: (id: string) => restRemove.mutateAsync(id),
      loading: restCreate.isPending || restUpdate.isPending || restRemove.isPending,
      error:
        (restCreate.error ?? restUpdate.error ?? restRemove.error) instanceof Error
          ? ((restCreate.error ?? restUpdate.error ?? restRemove.error) as Error).message
          : undefined,
    };
  }
  return {
    create: graphqlCreate.mutate,
    update: graphqlUpdate.mutate,
    remove: graphqlRemove.mutate,
    loading: graphqlCreate.loading || graphqlUpdate.loading || graphqlRemove.loading,
    error: (graphqlCreate.error ?? graphqlUpdate.error ?? graphqlRemove.error)?.message,
  };
}
