import { Injectable, signal } from '@angular/core';

/**
 * Tracks how many real HTTP requests were made to render the current view.
 * Populated by the REST HttpInterceptor (see http/rest-count.interceptor.ts)
 * and the GraphQL Apollo link (see graphql/graphql-count.link.ts) — this is
 * what backs the request-count panel in the dashboard.
 */
@Injectable({ providedIn: 'root' })
export class RequestCounterService {
  private readonly restSignal = signal(0);
  private readonly graphqlSignal = signal(0);
  private readonly restLogSignal = signal<string[]>([]);
  private readonly graphqlLogSignal = signal<string[]>([]);

  readonly restCount = this.restSignal.asReadonly();
  readonly graphqlCount = this.graphqlSignal.asReadonly();
  readonly restLog = this.restLogSignal.asReadonly();
  readonly graphqlLog = this.graphqlLogSignal.asReadonly();

  recordRest(url: string): void {
    this.restSignal.update((c) => c + 1);
    this.restLogSignal.update((log) => [...log, url]);
  }

  recordGraphql(operationName: string): void {
    this.graphqlSignal.update((c) => c + 1);
    this.graphqlLogSignal.update((log) => [...log, operationName]);
  }

  reset(): void {
    this.restSignal.set(0);
    this.graphqlSignal.set(0);
    this.restLogSignal.set([]);
    this.graphqlLogSignal.set([]);
  }
}
