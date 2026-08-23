/**
 * One Apollo Client per backend, memoized. A custom link logs every
 * operation to requestLog (mirrors api/rest/client.ts's axios interceptor)
 * so the demo panel can show "1 request" for GraphQL next to REST's many.
 * fetchPolicy is network-only so switching screens always issues a real
 * request instead of silently serving from cache.
 */
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { getBackendUrls, type BackendKey } from '../../config/env';
import { logRequest } from '../../lib/requestLog';

const clients = new Map<BackendKey, ApolloClient>();

function createLoggingLink(backend: BackendKey): ApolloLink {
  return new ApolloLink((operation, forward) => {
    const opName = operation.operationName || 'anonymous';
    logRequest('graphql', 'POST', `${getBackendUrls(backend).graphql} (${opName})`);
    return forward(operation);
  });
}

export function getApolloClient(backend: BackendKey): ApolloClient {
  const existing = clients.get(backend);
  if (existing) return existing;

  const client = new ApolloClient({
    link: ApolloLink.from([createLoggingLink(backend), new HttpLink({ uri: getBackendUrls(backend).graphql })]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'network-only' },
      query: { fetchPolicy: 'network-only' },
    },
  });
  clients.set(backend, client);
  return client;
}
