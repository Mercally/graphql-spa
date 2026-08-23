import { IResolvers } from 'mercurius';
import { Services } from '../services';
import {
  mapCustomer,
  mapProject,
  mapTeam,
  mapUser,
  mapTask,
  mapTag,
  mapComment
} from '../mappers';

export interface GraphQLContext {
  services: Services;
}

// Augment Mercurius's own context type so `context()` and resolver `ctx`
// parameters agree on the shape without unsafe casts.
declare module 'mercurius' {
  interface MercuriusContext extends GraphQLContext {}
}

/**
 * GraphQL resolvers reuse the exact same service layer as the REST routes
 * (see src/services/index.ts) — no business logic is duplicated between the
 * two APIs, only the transport/shape differs.
 */
export function buildResolvers(): IResolvers<any, GraphQLContext> {
  return {
    Query: {
      customers: async (_root, args: { limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.customers.list(args.limit, args.offset);
        return items.map(mapCustomer);
      },
      customer: async (_root, args: { id: string }, ctx) => {
        const c = await ctx.services.customers.getById(args.id);
        return mapCustomer(c);
      },

      projects: async (_root, args: { customerId?: string; limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.projects.list(
          { customerId: args.customerId },
          args.limit,
          args.offset
        );
        return items.map(mapProject);
      },
      project: async (_root, args: { id: string }, ctx) => {
        const p = await ctx.services.projects.getById(args.id);
        return mapProject(p);
      },

      teams: async (_root, args: { projectId?: string; limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.teams.list({ projectId: args.projectId }, args.limit, args.offset);
        return items.map(mapTeam);
      },
      team: async (_root, args: { id: string }, ctx) => {
        const t = await ctx.services.teams.getById(args.id);
        return mapTeam(t);
      },

      users: async (_root, args: { limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.users.list(args.limit, args.offset);
        return items.map(mapUser);
      },
      user: async (_root, args: { id: string }, ctx) => {
        const u = await ctx.services.users.getById(args.id);
        return mapUser(u);
      },

      tasks: async (
        _root,
        args: { status?: string; projectId?: string; limit?: number; offset?: number },
        ctx
      ) => {
        const { items, total } = await ctx.services.tasks.list(
          { status: args.status as never, projectId: args.projectId },
          args.limit ?? 50,
          args.offset ?? 0
        );
        return { items: items.map(mapTask), total };
      },
      task: async (_root, args: { id: string }, ctx) => {
        const t = await ctx.services.tasks.getById(args.id);
        return mapTask(t);
      },

      tags: async (_root, args: { limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.tags.list(args.limit, args.offset);
        return items.map(mapTag);
      },
      tag: async (_root, args: { id: string }, ctx) => {
        const t = await ctx.services.tags.getById(args.id);
        return mapTag(t);
      },

      comments: async (_root, args: { taskId?: string; limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.comments.list({ taskId: args.taskId }, args.limit, args.offset);
        return items.map(mapComment);
      },
      comment: async (_root, args: { id: string }, ctx) => {
        const c = await ctx.services.comments.getById(args.id);
        return mapComment(c);
      }
    },

    Customer: {
      projects: async (parent: { id: string }, args: { limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.projects.list({ customerId: parent.id }, args.limit, args.offset);
        return items.map(mapProject);
      }
    },

    Project: {
      customer: async (parent: { customerId: string }, _args, ctx) => {
        const c = await ctx.services.customers.getById(parent.customerId);
        return mapCustomer(c);
      },
      tasks: async (
        parent: { id: string },
        args: { status?: string; limit?: number; offset?: number },
        ctx
      ) => {
        const { items } = await ctx.services.tasks.list(
          { projectId: parent.id, status: args.status as never },
          args.limit ?? 50,
          args.offset ?? 0
        );
        return items.map(mapTask);
      },
      teams: async (parent: { id: string }, args: { limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.teams.list({ projectId: parent.id }, args.limit, args.offset);
        return items.map(mapTeam);
      }
    },

    Team: {
      project: async (parent: { projectId: string }, _args, ctx) => {
        const p = await ctx.services.projects.getById(parent.projectId);
        return mapProject(p);
      },
      users: async (parent: { memberUserIds: string[] }, _args, ctx) => {
        const users = await Promise.all(
          parent.memberUserIds.map((id) => ctx.services.users.getById(id).catch(() => null))
        );
        return users.filter((u): u is NonNullable<typeof u> => u !== null).map(mapUser);
      }
    },

    Task: {
      project: async (parent: { projectId: string }, _args, ctx) => {
        const p = await ctx.services.projects.getById(parent.projectId);
        return mapProject(p);
      },
      assignedUser: async (parent: { assignedUserId: string | null }, _args, ctx) => {
        if (!parent.assignedUserId) return null;
        const u = await ctx.services.users.getById(parent.assignedUserId);
        return mapUser(u);
      },
      tags: async (parent: { tagIds: string[] }, _args, ctx) => {
        const tags = await Promise.all(
          parent.tagIds.map((id) => ctx.services.tags.getById(id).catch(() => null))
        );
        return tags.filter((t): t is NonNullable<typeof t> => t !== null).map(mapTag);
      },
      comments: async (parent: { id: string }, args: { limit?: number; offset?: number }, ctx) => {
        const items = await ctx.services.comments.list({ taskId: parent.id }, args.limit, args.offset);
        return items.map(mapComment);
      }
    },

    Comment: {
      task: async (parent: { taskId: string }, _args, ctx) => {
        const t = await ctx.services.tasks.getById(parent.taskId);
        return mapTask(t);
      },
      user: async (parent: { userId: string }, _args, ctx) => {
        const u = await ctx.services.users.getById(parent.userId);
        return mapUser(u);
      }
    },

    Mutation: {
      createCustomer: async (_root, args: { input: never }, ctx) => mapCustomer(await ctx.services.customers.create(args.input)),
      updateCustomer: async (_root, args: { id: string; input: never }, ctx) =>
        mapCustomer(await ctx.services.customers.update(args.id, args.input)),
      deleteCustomer: async (_root, args: { id: string }, ctx) => {
        await ctx.services.customers.remove(args.id);
        return true;
      },

      createProject: async (_root, args: { input: never }, ctx) => mapProject(await ctx.services.projects.create(args.input)),
      updateProject: async (_root, args: { id: string; input: never }, ctx) =>
        mapProject(await ctx.services.projects.update(args.id, args.input)),
      deleteProject: async (_root, args: { id: string }, ctx) => {
        await ctx.services.projects.remove(args.id);
        return true;
      },

      createTeam: async (_root, args: { input: never }, ctx) => mapTeam(await ctx.services.teams.create(args.input)),
      updateTeam: async (_root, args: { id: string; input: never }, ctx) =>
        mapTeam(await ctx.services.teams.update(args.id, args.input)),
      deleteTeam: async (_root, args: { id: string }, ctx) => {
        await ctx.services.teams.remove(args.id);
        return true;
      },

      createUser: async (_root, args: { input: never }, ctx) => mapUser(await ctx.services.users.create(args.input)),
      updateUser: async (_root, args: { id: string; input: never }, ctx) =>
        mapUser(await ctx.services.users.update(args.id, args.input)),
      deleteUser: async (_root, args: { id: string }, ctx) => {
        await ctx.services.users.remove(args.id);
        return true;
      },

      createTask: async (_root, args: { input: never }, ctx) => mapTask(await ctx.services.tasks.create(args.input)),
      updateTask: async (_root, args: { id: string; input: never }, ctx) =>
        mapTask(await ctx.services.tasks.update(args.id, args.input)),
      deleteTask: async (_root, args: { id: string }, ctx) => {
        await ctx.services.tasks.remove(args.id);
        return true;
      },

      createTag: async (_root, args: { input: never }, ctx) => mapTag(await ctx.services.tags.create(args.input)),
      updateTag: async (_root, args: { id: string; input: never }, ctx) =>
        mapTag(await ctx.services.tags.update(args.id, args.input)),
      deleteTag: async (_root, args: { id: string }, ctx) => {
        await ctx.services.tags.remove(args.id);
        return true;
      },

      createComment: async (_root, args: { input: never }, ctx) => mapComment(await ctx.services.comments.create(args.input)),
      updateComment: async (_root, args: { id: string; input: never }, ctx) =>
        mapComment(await ctx.services.comments.update(args.id, args.input)),
      deleteComment: async (_root, args: { id: string }, ctx) => {
        await ctx.services.comments.remove(args.id);
        return true;
      }
    }
  };
}
