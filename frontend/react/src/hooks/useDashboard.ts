import { useQuery } from '@tanstack/react-query';
import { useSettings } from '../config/SettingsContext';
import { fetchCustomerDashboardRest } from '../api/rest/dashboard';
import { useCustomerDashboardQuery } from '../api/graphql/dashboard';
import type { DashboardCustomer } from '../api/dashboardTypes';

export function useCustomerDashboard(customerId: string | undefined) {
  const { backend, mode } = useSettings();

  const rest = useQuery({
    queryKey: ['rest-dashboard', backend, customerId],
    queryFn: () => fetchCustomerDashboardRest(backend, customerId as string),
    enabled: mode === 'rest' && Boolean(customerId),
  });
  const graphql = useCustomerDashboardQuery(mode === 'graphql' ? customerId : undefined);

  if (mode === 'rest') {
    return {
      customer: (rest.data as DashboardCustomer | undefined) ?? null,
      loading: rest.isLoading,
      error: rest.error instanceof Error ? rest.error.message : undefined,
    };
  }
  return { customer: graphql.customer, loading: graphql.loading, error: graphql.error?.message };
}
