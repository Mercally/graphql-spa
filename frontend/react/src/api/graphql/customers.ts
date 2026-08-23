import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import type { BackendKey } from '../../config/env';
import type { Customer } from '../../types/entities';
import { getApolloClient } from './client';
import { idLiteral } from './support';
import { buildCreateMutation, buildDeleteMutation, buildUpdateMutation } from './mutationBuilder';

const CUSTOMER_FIELDS = 'id name email createdAt';

export function useCustomersListQuery(limit = 50, offset = 0, skip = false) {
  const doc = useMemo(
    () => gql(`query { customers(limit: ${limit}, offset: ${offset}) { ${CUSTOMER_FIELDS} } }`),
    [limit, offset]
  );
  const { data, loading, error, refetch } = useQuery<{ customers: Customer[] }>(doc, { skip });
  return { customers: data?.customers ?? [], loading, error, refetch };
}

export function useCustomerQuery(id: string | undefined, skip = false) {
  const doc = useMemo(() => gql(`query { customer(id: ${idLiteral(id ?? '')}) { ${CUSTOMER_FIELDS} } }`), [id]);
  const { data, loading, error, refetch } = useQuery<{ customer: Customer | null }>(doc, {
    skip: !id || skip,
  });
  return { customer: data?.customer ?? null, loading, error, refetch };
}

export async function createCustomer(backend: BackendKey, name: string, email: string): Promise<Customer> {
  const doc = buildCreateMutation(
    backend,
    'createCustomer',
    [
      { name: 'name', kind: 'string', value: name },
      { name: 'email', kind: 'string', value: email },
    ],
    CUSTOMER_FIELDS
  );
  const result = await getApolloClient(backend).mutate<{ createCustomer: Customer }>({ mutation: doc });
  if (!result.data) throw new Error('createCustomer returned no data');
  return result.data.createCustomer;
}

export async function updateCustomer(
  backend: BackendKey,
  id: string,
  name: string,
  email: string
): Promise<Customer> {
  const doc = buildUpdateMutation(
    backend,
    'updateCustomer',
    id,
    [
      { name: 'name', kind: 'string', value: name },
      { name: 'email', kind: 'string', value: email },
    ],
    CUSTOMER_FIELDS
  );
  const result = await getApolloClient(backend).mutate<{ updateCustomer: Customer }>({ mutation: doc });
  if (!result.data) throw new Error('updateCustomer returned no data');
  return result.data.updateCustomer;
}

export async function deleteCustomer(backend: BackendKey, id: string): Promise<void> {
  const doc = buildDeleteMutation(backend, 'deleteCustomer', id);
  await getApolloClient(backend).mutate({ mutation: doc });
}
