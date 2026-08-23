import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { CustomersRestService } from './rest/customers.rest.service';
import { CustomersGraphqlService } from './graphql/customers.graphql.service';
import { Customer, CreateCustomerInput, ListResult, UpdateCustomerInput } from '../models/models';
import { ListParams } from './list.util';

/**
 * Facade components depend on. Delegates to whichever concrete client
 * (REST or GraphQL) is currently active per SettingsService — the two
 * implementations are never mixed within a single call.
 */
@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly rest = inject(CustomersRestService);
  private readonly gql = inject(CustomersGraphqlService);
  private readonly settings = inject(SettingsService);

  list(params: ListParams = {}): Observable<ListResult<Customer>> {
    return this.settings.mode() === 'rest' ? this.rest.list(params) : this.gql.list(params);
  }

  getById(id: string): Observable<Customer> {
    return this.settings.mode() === 'rest' ? this.rest.getById(id) : this.gql.getById(id);
  }

  create(input: CreateCustomerInput): Observable<Customer> {
    return this.settings.mode() === 'rest' ? this.rest.create(input) : this.gql.create(input);
  }

  update(id: string, input: Required<UpdateCustomerInput>): Observable<Customer> {
    return this.settings.mode() === 'rest' ? this.rest.update(id, input) : this.gql.update(id, input);
  }

  remove(id: string): Observable<void> {
    return this.settings.mode() === 'rest'
      ? this.rest.remove(id)
      : (this.gql.remove(id) as unknown as Observable<void>);
  }
}
