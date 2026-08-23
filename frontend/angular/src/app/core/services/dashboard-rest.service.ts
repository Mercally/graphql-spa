import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CustomersRestService } from './rest/customers.rest.service';
import { ProjectsRestService } from './rest/projects.rest.service';
import { TasksRestService } from './rest/tasks.rest.service';
import { TeamsRestService } from './rest/teams.rest.service';
import { UsersRestService } from './rest/users.rest.service';
import { TagsRestService } from './rest/tags.rest.service';
import { CommentsRestService } from './rest/comments.rest.service';
import {
  DashboardCustomer,
  DashboardProject,
  DashboardTask,
  DashboardTeam,
  Project,
  Task,
  Team
} from '../models/models';

/**
 * Builds the nested Customer -> Projects -> Tasks/Teams dashboard the way a
 * REST-only client has to: one request per hop, exactly as described in
 * docs/graphql-vs-rest.md. Every call here goes through HttpClient, so the
 * rest-count.interceptor tallies each one — that tally is what the dashboard
 * UI displays next to the single GraphQL request count.
 */
@Injectable({ providedIn: 'root' })
export class DashboardRestService {
  private readonly customers = inject(CustomersRestService);
  private readonly projects = inject(ProjectsRestService);
  private readonly tasks = inject(TasksRestService);
  private readonly teams = inject(TeamsRestService);
  private readonly users = inject(UsersRestService);
  private readonly tags = inject(TagsRestService);
  private readonly comments = inject(CommentsRestService);

  getDashboard(customerId: string): Observable<DashboardCustomer> {
    return this.customers.getById(customerId).pipe(
      switchMap((customer) =>
        this.projects.list({ customerId, limit: 100 }).pipe(
          switchMap((result) =>
            result.items.length
              ? forkJoin(result.items.map((project) => this.buildProject(project)))
              : of([] as DashboardProject[])
          ),
          map((projects) => ({ ...customer, projects }))
        )
      )
    );
  }

  private buildProject(project: Project): Observable<DashboardProject> {
    return forkJoin({
      tasks: this.tasks.list({ projectId: project.id, limit: 200 }).pipe(
        switchMap((result) =>
          result.items.length
            ? forkJoin(result.items.map((task) => this.buildTask(task)))
            : of([] as DashboardTask[])
        )
      ),
      teams: this.teams.list({ projectId: project.id, limit: 50 }).pipe(
        switchMap((result) =>
          result.items.length
            ? forkJoin(result.items.map((team) => this.buildTeam(team)))
            : of([] as DashboardTeam[])
        )
      )
    }).pipe(map(({ tasks, teams }) => ({ ...project, tasks, teams })));
  }

  private buildTask(task: Task): Observable<DashboardTask> {
    const assignedUser$ = task.assignedUserId ? this.users.getById(task.assignedUserId) : of(undefined);
    const tags$ = task.tagIds.length
      ? forkJoin(task.tagIds.map((id) => this.tags.getById(id)))
      : of([]);
    const comments$ = this.comments.list({ taskId: task.id, limit: 100 }).pipe(map((r) => r.items));
    return forkJoin({ assignedUser: assignedUser$, tags: tags$, comments: comments$ }).pipe(
      map(({ assignedUser, tags, comments }) => ({ ...task, assignedUser, tags, comments }))
    );
  }

  private buildTeam(team: Team): Observable<DashboardTeam> {
    const users$ = team.memberUserIds.length
      ? forkJoin(team.memberUserIds.map((id) => this.users.getById(id)))
      : of([]);
    return users$.pipe(map((users) => ({ ...team, users })));
  }
}
