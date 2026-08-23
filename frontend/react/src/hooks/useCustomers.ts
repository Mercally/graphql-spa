/**
 * Facade hooks: pick REST (axios + TanStack Query) or GraphQL (Apollo) based
 * on the active SettingsContext mode. Both underlying hooks are always
 * called (React hook-order rule), but only the active one is enabled, so
 * only one of them actually performs network I/O per render - REST and
 * GraphQL are never blended within a single request.
 */
import { useSettings } from '../config/SettingsContext';
import { customersResource } from '../api/rest/resources';
import { useCustomerQuery, useCustomersListQuery } from '../api/graphql/customers';
import type { Customer } from '../types/entities';

export function useCustomersList(page = 1, pageSize = 50) {
  const { backend, mode } = useSettings();
  const rest = customersResource.useList(backend, {}, page, pageSize, mode === 'rest');
  const graphql = useCustomersListQuery(pageSize, (page - 1) * pageSize, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      items: rest.data?.items ?? [],
      total: rest.data?.total ?? 0,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return {
    items: graphql.customers,
    total: graphql.customers.length,
    loading: graphql.loading,
    error: graphql.error?.message,
  };
}

export function useCustomer(id: string | undefined) {
  const { backend, mode } = useSettings();
  const rest = customersResource.useItem(backend, id, mode === 'rest');
  const graphql = useCustomerQuery(id, mode !== 'graphql');

  if (mode === 'rest') {
    return {
      item: (rest.data as Customer | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { item: graphql.customer, loading: graphql.loading, error: graphql.error?.message };
}
