/**
 * Builds a full `Services` container backed by simple in-memory maps instead
 * of a real MongoDB connection, for REST integration tests via Fastify's
 * `inject()`. Reuses the real service classes (no logic duplicated) — only
 * the repository layer is faked.
 */
import { ObjectId } from 'mongodb';
import { Customer, Project, Team, User, Task, Tag, Comment } from '../../src/models/entities';
import { CustomerService } from '../../src/services/customer.service';
import { ProjectService } from '../../src/services/project.service';
import { TeamService } from '../../src/services/team.service';
import { UserService } from '../../src/services/user.service';
import { TaskService } from '../../src/services/task.service';
import { TagService } from '../../src/services/tag.service';
import { CommentService } from '../../src/services/comment.service';
import { Services } from '../../src/services';

function fakeStore<T extends { _id: ObjectId }>() {
  const store = new Map<string, T>();
  return {
    store,
    findAll: async () => Array.from(store.values()),
    findById: async (id: ObjectId) => store.get(id.toHexString()) ?? null,
    findByIds: async (ids: ObjectId[]) =>
      Array.from(store.values()).filter((doc) => ids.some((id) => id.equals(doc._id))),
    insert: async (doc: T) => {
      const _id = new ObjectId();
      const saved = { ...doc, _id } as T;
      store.set(_id.toHexString(), saved);
      return saved;
    },
    updateById: async (id: ObjectId, update: Partial<T>) => {
      const existing = store.get(id.toHexString());
      if (!existing) return null;
      const updated = { ...existing, ...update };
      store.set(id.toHexString(), updated);
      return updated;
    },
    deleteById: async (id: ObjectId) => store.delete(id.toHexString())
  };
}

export function buildTestServices(): Services {
  const customerStore = fakeStore<Customer>();
  const projectStore = fakeStore<Project>();
  const teamStore = fakeStore<Team>();
  const userStore = fakeStore<User>();
  const taskStore = fakeStore<Task>();
  const tagStore = fakeStore<Tag>();
  const commentStore = fakeStore<Comment>();

  const projectRepo = {
    ...projectStore,
    findByCustomerId: async (customerId: ObjectId) =>
      Array.from(projectStore.store.values()).filter((p) => p.customerId.equals(customerId))
  } as never;

  const teamRepo = {
    ...teamStore,
    findByProjectId: async (projectId: ObjectId) =>
      Array.from(teamStore.store.values()).filter((t) => t.projectId.equals(projectId))
  } as never;

  const taskRepo = {
    ...taskStore,
    findByProjectId: async (projectId: ObjectId) =>
      Array.from(taskStore.store.values()).filter((t) => t.projectId.equals(projectId)),
    findFiltered: async (filter: { projectId?: ObjectId; status?: string }) =>
      Array.from(taskStore.store.values()).filter((t) => {
        if (filter.projectId && !t.projectId.equals(filter.projectId)) return false;
        if (filter.status && t.status !== filter.status) return false;
        return true;
      }),
    countFiltered: async (filter: { projectId?: ObjectId; status?: string }) =>
      Array.from(taskStore.store.values()).filter((t) => {
        if (filter.projectId && !t.projectId.equals(filter.projectId)) return false;
        if (filter.status && t.status !== filter.status) return false;
        return true;
      }).length
  } as never;

  const commentRepo = {
    ...commentStore,
    findByTaskId: async (taskId: ObjectId) =>
      Array.from(commentStore.store.values()).filter((c) => c.taskId.equals(taskId))
  } as never;

  const customerRepo = customerStore as never;
  const userRepo = userStore as never;
  const tagRepo = tagStore as never;

  return {
    repos: { customers: customerRepo, projects: projectRepo, teams: teamRepo, users: userRepo, tasks: taskRepo, tags: tagRepo, comments: commentRepo },
    customers: new CustomerService(customerRepo),
    projects: new ProjectService(projectRepo, customerRepo),
    teams: new TeamService(teamRepo, projectRepo, userRepo),
    users: new UserService(userRepo),
    tasks: new TaskService(taskRepo, projectRepo, userRepo, tagRepo),
    tags: new TagService(tagRepo),
    comments: new CommentService(commentRepo, taskRepo, userRepo)
  };
}
