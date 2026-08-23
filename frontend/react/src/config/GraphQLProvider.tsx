import type { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { useSettings } from './SettingsContext';
import { getApolloClient } from '../api/graphql/client';

/**
 * Supplies the ApolloClient instance matching the currently selected backend
 * (dotnet/node). Re-renders (and swaps the client the ApolloProvider hands
 * down) whenever the user flips the backend toggle in SettingsBar.
 */
export function GraphQLProvider({ children }: { children: ReactNode }) {
  const { backend } = useSettings();
  return <ApolloProvider client={getApolloClient(backend)}>{children}</ApolloProvider>;
}
