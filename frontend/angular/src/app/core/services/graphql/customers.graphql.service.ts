import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../settings/settings.service';
import { Customer, CreateCustomerInput, ListResult, UpdateCustomerInput } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id name email createdAt';

const LIST_QUERY = gql`
  query Customers($limit: Int, $offset: Int) {
    customers(limit: $limit, offset: $offset) { ${FIELDS} }
  }
`;

const GET_QUERY = gql`
  query Customer($id: ID!) {
    customer(id: $id) { ${FIELDS} }
  }
`;

/**
 * GraphQL client for Customer, including mutations. .NET's schema takes
 * `name`/`email` as flat arguments while Node wraps them in an `input`
 * object — both dialects are built here so the component layer never has to
 * know which backend is active.
 */
@Injectable({ providedIn: 'root' })
export class CustomersGraphqlService {
  private readonly apollo = inject(Apollo);
  private readonly settings = inject(SettingsService);

  list(params: ListParams = {}): Observable<ListResult<Customer>> {
    return this.apollo
      .query<{ customers: Customer[] }>({
        query: LIST_QUERY,
        variables: { limit: params.limit ?? 20, offset: params.offset ?? 0 }
      })
      .pipe(map((result) => normalizeList<Customer>(result.data.customers)));
  }

  getById(id: string): Observable<Customer> {
    return this.apollo
      .query<{ customer: Customer }>({ query: GET_QUERY, variables: { id } })
      .pipe(map((result) => result.data.customer));
  }

  create(input: CreateCustomerInput): Observable<Customer> {
    const mutation =
      this.settings.backend() === 'dotnet'
        ? gql`
            mutation CreateCustomer($name: String!, $email: String!) {
              createCustomer(name: $name, email: $email) { ${FIELDS} }
            }
          `
        : gql`
            mutation CreateCustomer($input: CreateCustomerInput!) {
              createCustomer(input: $input) { ${FIELDS} }
            }
          `;
    const variables = this.settings.backend() === 'dotnet' ? input : { input };
    return this.apollo
      .mutate<{ createCustomer: Customer }>({ mutation, variables })
      .pipe(map((result) => result.data!.createCustomer));
  }

  /** Always send name+email — .NET's updateCustomer requires both as non-null args. */
  update(id: string, input: Required<UpdateCustomerInput>): Observable<Customer> {
    const mutation =
      this.settings.backend() === 'dotnet'
        ? gql`
            mutation UpdateCustomer($id: ID!, $name: String!, $email: String!) {
              updateCustomer(id: $id, name: $name, email: $email) { ${FIELDS} }
            }
          `
        : gql`
            mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
              updateCustomer(id: $id, input: $input) { ${FIELDS} }
            }
          `;
    const variables =
      this.settings.backend() === 'dotnet' ? { id, ...input } : { id, input };
    return this.apollo
      .mutate<{ updateCustomer: Customer }>({ mutation, variables })
      .pipe(map((result) => result.data!.updateCustomer));
  }

  remove(id: string): Observable<boolean> {
    const mutation = gql`
      mutation DeleteCustomer($id: ID!) {
        deleteCustomer(id: $id)
      }
    `;
    return this.apollo
      .mutate<{ deleteCustomer: boolean }>({ mutation, variables: { id } })
      .pipe(map((result) => !!result.data?.deleteCustomer));
  }
}
