/**
 * REST re-implementation of the "customer dashboard" nested view described in
 * docs/graphql-vs-rest.md: walk customer -> projects -> tasks/teams -> their
 * relations one hop at a time. Every GET below goes through getRestClient(),
 * whose interceptor logs it to requestLog, so the panel in DashboardPage
 * shows the real number of round trips this took (deliberately many).
 *
 * Per-id GETs (user/tag) are memoized within a single run so the same
 * assigned user or tag referenced twice isn't fetched twice — the same thing
 * any reasonable REST client would do — while still issuing a distinct
 * request per project/task/team hop as the docs describe.
 */
import { getRestClient } from './client';
import type { BackendKey } from '../../config/env';
import type { Customer, Project, Task, Team, User, Tag, Comment } from '../../types/entities';
import type {
  DashboardCustomer,
  DashboardProject,
  DashboardTask,
  DashboardTeam,
  DashboardUserRef,
  DashboardTagRef,
} from '../dashboardTypes';

export async function fetchCustomerDashboardRest(
  backend: BackendKey,
  customerId: string
): Promise<DashboardCustomer> {
  const client = getRestClient(backend);
  const userCache = new Map<string, Promise<User>>();
  const tagCache = new Map<string, Promise<Tag>>();

  function getUser(id: string): Promise<User> {
    let cached = userCache.get(id);
    if (!cached) {
      cached = client.get<User>(`/users/${id}`).then((r) => r.data);
      userCache.set(id, cached);
    }
    return cached;
  }

  function getTag(id: string): Promise<Tag> {
    let cached = tagCache.get(id);
    if (!cached) {
      cached = client.get<Tag>(`/tags/${id}`).then((r) => r.data);
      tagCache.set(id, cached);
    }
    return cached;
  }

  const { data: customer } = await client.get<Customer>(`/customers/${customerId}`);

  const { data: projectsRaw } = await client.get(`/projects`, {
    params: { customerId, limit: 100, page: 1, pageSize: 100 },
  });
  const projects: Project[] = Array.isArray(projectsRaw) ? projectsRaw : (projectsRaw.items ?? []);

  const dashboardProjects: DashboardProject[] = await Promise.all(
    projects.map(async (project): Promise<DashboardProject> => {
      const [tasksRaw, teamsRaw] = await Promise.all([
        client.get(`/tasks`, { params: { projectId: project.id, limit: 100, page: 1, pageSize: 100 } }),
        client.get(`/teams`, { params: { projectId: project.id, limit: 100, page: 1, pageSize: 100 } }),
      ]);
      const tasks: Task[] = Array.isArray(tasksRaw.data) ? tasksRaw.data : (tasksRaw.data.items ?? []);
      const teams: Team[] = Array.isArray(teamsRaw.data) ? teamsRaw.data : (teamsRaw.data.items ?? []);

      const dashboardTasks: DashboardTask[] = await Promise.all(
        tasks.map(async (task): Promise<DashboardTask> => {
          const [assignedUser, tags, commentsRaw] = await Promise.all([
            task.assignedUserId ? getUser(task.assignedUserId) : Promise.resolve(null),
            Promise.all((task.tagIds ?? []).map((tagId) => getTag(tagId))),
            client.get(`/comments`, { params: { taskId: task.id, limit: 100, page: 1, pageSize: 100 } }),
          ]);
          const comments: Comment[] = Array.isArray(commentsRaw.data)
            ? commentsRaw.data
            : (commentsRaw.data.items ?? []);
          const assignedUserRef: DashboardUserRef | null = assignedUser
            ? { id: assignedUser.id, name: assignedUser.name }
            : null;
          const tagRefs: DashboardTagRef[] = tags.map((t) => ({ id: t.id, name: t.name }));
          return {
            id: task.id,
            title: task.title,
            status: task.status,
            assignedUser: assignedUserRef,
            tags: tagRefs,
            comments: comments.map((c) => ({ id: c.id, text: c.text })),
          };
        })
      );

      const dashboardTeams: DashboardTeam[] = await Promise.all(
        teams.map(async (team): Promise<DashboardTeam> => {
          const users = await Promise.all((team.memberUserIds ?? []).map((userId) => getUser(userId)));
          return {
            id: team.id,
            name: team.name,
            users: users.map((u) => ({ id: u.id, name: u.name })),
          };
        })
      );

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        tasks: dashboardTasks,
        teams: dashboardTeams,
      };
    })
  );

  return { id: customer.id, name: customer.name, projects: dashboardProjects };
}
