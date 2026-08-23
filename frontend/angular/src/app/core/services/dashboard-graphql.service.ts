import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardCustomer } from '../models/models';

// Matches the exact shape documented in docs/api-examples.md ("Query: full
// nested dashboard") and docs/graphql-vs-rest.md — one query, one request,
// for the whole Customer -> Projects -> Tasks/Teams tree.
const DASHBOARD_QUERY = gql`
  query CustomerDashboard($id: ID!) {
    customer(id: $id) {
      id
      name
      email
      createdAt
      projects {
        id
        name
        description
        customerId
        status
        createdAt
        updatedAt
        tasks {
          id
          title
          description
          projectId
          status
          assignedUserId
          tagIds
          createdAt
          updatedAt
          assignedUser { id name email role createdAt }
          tags { id name color createdAt }
          comments { id text taskId userId createdAt }
        }
        teams {
          id
          name
          projectId
          memberUserIds
          createdAt
          users { id name email role createdAt }
        }
      }
    }
  }
`;

/**
 * Builds the same nested dashboard as DashboardRestService, but via exactly
 * one GraphQL request — the headline REST-vs-GraphQL comparison of this PoC.
 */
@Injectable({ providedIn: 'root' })
export class DashboardGraphqlService {
  private readonly apollo = inject(Apollo);

  getDashboard(customerId: string): Observable<DashboardCustomer> {
    return this.apollo
      .query<{ customer: DashboardCustomer }>({ query: DASHBOARD_QUERY, variables: { id: customerId } })
      .pipe(map((result) => result.data.customer));
  }
}
