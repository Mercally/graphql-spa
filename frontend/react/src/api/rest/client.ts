/**
 * One axios instance per backend, memoized. A request interceptor pushes an
 * entry into the shared requestLog so the REST-vs-GraphQL demo panel can show
 * real network activity counts (Requirements.md section 19).
 */
import axios, { type AxiosInstance } from 'axios';
import { getBackendUrls, type BackendKey } from '../../config/env';
import { logRequest } from '../../lib/requestLog';

const clients = new Map<BackendKey, AxiosInstance>();
const metaClients = new Map<BackendKey, AxiosInstance>();

export function getRestClient(backend: BackendKey): AxiosInstance {
  const existing = clients.get(backend);
  if (existing) return existing;

  const client = axios.create({ baseURL: getBackendUrls(backend).rest });
  client.interceptors.request.use((config) => {
    const method = (config.method ?? 'get').toUpperCase();
    const target = `${config.baseURL ?? ''}${config.url ?? ''}`;
    logRequest('rest', method, target);
    return config;
  });
  clients.set(backend, client);
  return client;
}

/**
 * Same base URL, but WITHOUT the requestLog interceptor. Used only for
 * incidental "app chrome" lookups (e.g. populating the customer picker on
 * the dashboard, or dropdown options in forms) that aren't part of whatever
 * REST-vs-GraphQL comparison is being measured on screen, so they don't
 * inflate the visible request count.
 */
export function getMetaRestClient(backend: BackendKey): AxiosInstance {
  const existing = metaClients.get(backend);
  if (existing) return existing;
  const client = axios.create({ baseURL: getBackendUrls(backend).rest });
  metaClients.set(backend, client);
  return client;
}
