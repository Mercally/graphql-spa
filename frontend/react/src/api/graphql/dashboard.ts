import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { idLiteral } from './support';
import type { DashboardCustomer } from '../dashboardTypes';

/**
 * The flagship comparison query (docs/api-examples.md "CustomerDashboard").
 * Object-type field structure (customer -> projects -> tasks/teams -> ...)
 * happens to be identical on both backends, so a single document works for
 * both - only mutations and the tasks-list wrapper actually differ between
 * .NET and Node (see api/graphql/mutationBuilder.ts and tasks.ts).
 */
export function useCustomerDashboardQuery(customerId: string | undefined) {
  const doc = useMemo(
    () =>
      gql(`query CustomerDashboard {
        customer(id: ${idLiteral(customerId ?? '')}) {
          id
          name
          projects {
            id
            name
            status
            tasks {
              id
              title
              status
              assignedUser { id name }
              tags { id name }
              comments { id text }
            }
            teams {
              id
              name
              users { id name }
            }
          }
        }
      }`),
    [customerId]
  );

  const { data, loading, error, refetch } = useQuery<{ customer: DashboardCustomer | null }>(doc, {
    skip: !customerId,
  });

  return { customer: data?.customer ?? null, loading, error, refetch };
}
