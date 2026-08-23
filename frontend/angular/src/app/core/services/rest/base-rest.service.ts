import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../settings/settings.service';
import { ListResult } from '../../models/models';
import { ListParams, normalizeList, toDotnetParams, toNodeParams } from '../list.util';

/**
 * Generic REST client for one collection (e.g. /api/customers). Each entity's
 * REST service is a thin subclass that only sets `path`. Handles the
 * page/pageSize (.NET) vs limit/offset (Node) pagination dialect difference
 * transparently so callers always use offset/limit.
 */
export abstract class BaseRestService<T, CreateInput, UpdateInput> {
  protected readonly http = inject(HttpClient);
  protected readonly settings = inject(SettingsService);
  protected abstract readonly path: string;

  list(params: ListParams = {}): Observable<ListResult<T>> {
    const httpParams =
      this.settings.backend() === 'dotnet' ? toDotnetParams(params) : toNodeParams(params);
    return this.http
      .get<unknown>(`${this.settings.restBaseUrl()}/${this.path}`, { params: httpParams })
      .pipe(map((raw) => normalizeList<T>(raw)));
  }

  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.settings.restBaseUrl()}/${this.path}/${id}`);
  }

  create(input: CreateInput): Observable<T> {
    return this.http.post<T>(`${this.settings.restBaseUrl()}/${this.path}`, input);
  }

  update(id: string, input: UpdateInput): Observable<T> {
    return this.http.put<T>(`${this.settings.restBaseUrl()}/${this.path}/${id}`, input);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.settings.restBaseUrl()}/${this.path}/${id}`);
  }
}
