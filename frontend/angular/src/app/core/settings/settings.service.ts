import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export type ClientMode = 'rest' | 'graphql';
export type BackendId = 'dotnet' | 'node';

const MODE_KEY = 'workapi.mode';
const BACKEND_KEY = 'workapi.backend';

/**
 * Single source of truth for "which client mode" (REST vs GraphQL) and
 * "which backend" (.NET vs Node) the app currently talks to. Read by every
 * facade service to decide which underlying implementation to call, and by
 * the header dropdown to let the user switch at runtime without a rebuild.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly modeSignal = signal<ClientMode>(this.readStored(MODE_KEY, 'graphql') as ClientMode);
  private readonly backendSignal = signal<BackendId>(this.readStored(BACKEND_KEY, 'dotnet') as BackendId);

  readonly mode = this.modeSignal.asReadonly();
  readonly backend = this.backendSignal.asReadonly();

  readonly restBaseUrl = computed(() => environment.backends[this.backendSignal()].restBaseUrl);
  readonly graphqlUrl = computed(() => environment.backends[this.backendSignal()].graphqlUrl);
  readonly backendLabel = computed(() => environment.backends[this.backendSignal()].label);

  setMode(mode: ClientMode): void {
    this.modeSignal.set(mode);
    localStorage.setItem(MODE_KEY, mode);
  }

  setBackend(backend: BackendId): void {
    this.backendSignal.set(backend);
    localStorage.setItem(BACKEND_KEY, backend);
  }

  private readStored(key: string, fallback: string): string {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }
}
