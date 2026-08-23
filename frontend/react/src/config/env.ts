export type BackendKey = 'dotnet' | 'node';
export type DataMode = 'rest' | 'graphql';

interface BackendUrls {
  rest: string;
  graphql: string;
  label: string;
}

const BACKENDS: Record<BackendKey, BackendUrls> = {
  dotnet: {
    rest: import.meta.env.VITE_DOTNET_API_URL ?? 'http://localhost:5000/api',
    graphql: import.meta.env.VITE_DOTNET_GRAPHQL_URL ?? 'http://localhost:5000/graphql',
    label: '.NET',
  },
  node: {
    rest: import.meta.env.VITE_NODE_API_URL ?? 'http://localhost:4000/api',
    graphql: import.meta.env.VITE_NODE_GRAPHQL_URL ?? 'http://localhost:4000/graphql',
    label: 'Node.js',
  },
};

export function getBackendUrls(backend: BackendKey): BackendUrls {
  return BACKENDS[backend];
}

export const DEFAULT_BACKEND: BackendKey =
  (import.meta.env.VITE_DEFAULT_BACKEND as BackendKey) ?? 'node';

export const DEFAULT_MODE: DataMode = (import.meta.env.VITE_DEFAULT_MODE as DataMode) ?? 'rest';

export const BACKEND_OPTIONS: { key: BackendKey; label: string }[] = (
  Object.keys(BACKENDS) as BackendKey[]
).map((key) => ({ key, label: BACKENDS[key].label }));
