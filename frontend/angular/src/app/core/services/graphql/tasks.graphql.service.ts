import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '../../settings/settings.service';
import { CreateTaskInput, ListResult, Task, UpdateTaskInput } from '../../models/models';
import { ListParams, normalizeList } from '../list.util';

const FIELDS = 'id title description projectId status assignedUserId tagIds createdAt updatedAt';

const GET_QUERY = gql`
  query Task($id: ID!) {
    task(id: $id) { ${FIELDS} }
  }
`;

/**
 * GraphQL client for Task. The one real schema divergence between backends
 * lives here: .NET's `tasks` field returns a bare `[Task!]!` list while
 * Node's returns `TaskPage { items, total }` — both query shapes are built
 * per active backend and `normalizeList` reconciles the result shape.
 */
@Injectable({ providedIn: 'root' })
export class TasksGraphqlService {
  private readonly apollo = inject(Apollo);
  private readonly settings = inject(SettingsService);

  list(params: ListParams & { status?: string; projectId?: string } = {}): Observable<ListResult<Task>> {
    const isDotnet = this.settings.backend() === 'dotnet';
    const query = isDotnet
      ? gql`
          query Tasks($limit: Int, $offset: Int, $status: String, $projectId: String) {
            tasks(limit: $limit, offset: $offset, status: $status, projectId: $projectId) { ${FIELDS} }
          }
        `
      : gql`
          query Tasks($limit: Int, $offset: Int, $status: TaskStatus, $projectId: ID) {
            tasks(limit: $limit, offset: $offset, status: $status, projectId: $projectId) {
              items { ${FIELDS} }
              total
            }
          }
        `;
    return this.apollo
      .query<{ tasks: unknown }>({
        query,
        variables: {
          limit: params.limit ?? 20,
          offset: params.offset ?? 0,
          status: params.status ?? null,
          projectId: params.projectId ?? null
        }
      })
      .pipe(map((result) => normalizeList<Task>(result.data.tasks)));
  }

  getById(id: string): Observable<Task> {
    return this.apollo
      .query<{ task: Task }>({ query: GET_QUERY, variables: { id } })
      .pipe(map((result) => result.data.task));
  }

  create(input: CreateTaskInput): Observable<Task> {
    const isDotnet = this.settings.backend() === 'dotnet';
    const mutation = isDotnet
      ? gql`
          mutation CreateTask(
            $title: String!
            $description: String
            $projectId: String!
            $status: String!
            $assignedUserId: String
            $tagIds: [String]
          ) {
            createTask(
              title: $title
              description: $description
              projectId: $projectId
              status: $status
              assignedUserId: $assignedUserId
              tagIds: $tagIds
            ) { ${FIELDS} }
          }
        `
      : gql`
          mutation CreateTask($input: CreateTaskInput!) {
            createTask(input: $input) { ${FIELDS} }
          }
        `;
    const variables = isDotnet ? input : { input };
    return this.apollo
      .mutate<{ createTask: Task }>({ mutation, variables })
      .pipe(map((result) => result.data!.createTask));
  }

  /** Always send `title` — both backends require it (non-null arg on .NET, always-known on Node). */
  update(id: string, input: UpdateTaskInput & { title: string }): Observable<Task> {
    const isDotnet = this.settings.backend() === 'dotnet';
    const mutation = isDotnet
      ? gql`
          mutation UpdateTask(
            $id: ID!
            $title: String!
            $description: String
            $status: String
            $assignedUserId: String
            $tagIds: [String]
          ) {
            updateTask(
              id: $id
              title: $title
              description: $description
              status: $status
              assignedUserId: $assignedUserId
              tagIds: $tagIds
            ) { ${FIELDS} }
          }
        `
      : gql`
          mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
            updateTask(id: $id, input: $input) { ${FIELDS} }
          }
        `;
    const variables = isDotnet ? { id, ...input } : { id, input };
    return this.apollo
      .mutate<{ updateTask: Task }>({ mutation, variables })
      .pipe(map((result) => result.data!.updateTask));
  }

  remove(id: string): Observable<boolean> {
    const mutation = gql`
      mutation DeleteTask($id: ID!) {
        deleteTask(id: $id)
      }
    `;
    return this.apollo
      .mutate<{ deleteTask: boolean }>({ mutation, variables: { id } })
      .pipe(map((result) => !!result.data?.deleteTask));
  }
}
