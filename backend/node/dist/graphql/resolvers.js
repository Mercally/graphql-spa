"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResolvers = buildResolvers;
const mappers_1 = require("../mappers");
/**
 * GraphQL resolvers reuse the exact same service layer as the REST routes
 * (see src/services/index.ts) — no business logic is duplicated between the
 * two APIs, only the transport/shape differs.
 */
function buildResolvers() {
    return {
        Query: {
            customers: async (_root, args, ctx) => {
                const items = await ctx.services.customers.list(args.limit, args.offset);
                return items.map(mappers_1.mapCustomer);
            },
            customer: async (_root, args, ctx) => {
                const c = await ctx.services.customers.getById(args.id);
                return (0, mappers_1.mapCustomer)(c);
            },
            projects: async (_root, args, ctx) => {
                const items = await ctx.services.projects.list({ customerId: args.customerId }, args.limit, args.offset);
                return items.map(mappers_1.mapProject);
            },
            project: async (_root, args, ctx) => {
                const p = await ctx.services.projects.getById(args.id);
                return (0, mappers_1.mapProject)(p);
            },
            teams: async (_root, args, ctx) => {
                const items = await ctx.services.teams.list({ projectId: args.projectId }, args.limit, args.offset);
                return items.map(mappers_1.mapTeam);
            },
            team: async (_root, args, ctx) => {
                const t = await ctx.services.teams.getById(args.id);
                return (0, mappers_1.mapTeam)(t);
            },
            users: async (_root, args, ctx) => {
                const items = await ctx.services.users.list(args.limit, args.offset);
                return items.map(mappers_1.mapUser);
            },
            user: async (_root, args, ctx) => {
                const u = await ctx.services.users.getById(args.id);
                return (0, mappers_1.mapUser)(u);
            },
            tasks: async (_root, args, ctx) => {
                const { items, total } = await ctx.services.tasks.list({ status: args.status, projectId: args.projectId }, args.limit ?? 50, args.offset ?? 0);
                return { items: items.map(mappers_1.mapTask), total };
            },
            task: async (_root, args, ctx) => {
                const t = await ctx.services.tasks.getById(args.id);
                return (0, mappers_1.mapTask)(t);
            },
            tags: async (_root, args, ctx) => {
                const items = await ctx.services.tags.list(args.limit, args.offset);
                return items.map(mappers_1.mapTag);
            },
            tag: async (_root, args, ctx) => {
                const t = await ctx.services.tags.getById(args.id);
                return (0, mappers_1.mapTag)(t);
            },
            comments: async (_root, args, ctx) => {
                const items = await ctx.services.comments.list({ taskId: args.taskId }, args.limit, args.offset);
                return items.map(mappers_1.mapComment);
            },
            comment: async (_root, args, ctx) => {
                const c = await ctx.services.comments.getById(args.id);
                return (0, mappers_1.mapComment)(c);
            }
        },
        Customer: {
            projects: async (parent, args, ctx) => {
                const items = await ctx.services.projects.list({ customerId: parent.id }, args.limit, args.offset);
                return items.map(mappers_1.mapProject);
            }
        },
        Project: {
            customer: async (parent, _args, ctx) => {
                const c = await ctx.services.customers.getById(parent.customerId);
                return (0, mappers_1.mapCustomer)(c);
            },
            tasks: async (parent, args, ctx) => {
                const { items } = await ctx.services.tasks.list({ projectId: parent.id, status: args.status }, args.limit ?? 50, args.offset ?? 0);
                return items.map(mappers_1.mapTask);
            },
            teams: async (parent, args, ctx) => {
                const items = await ctx.services.teams.list({ projectId: parent.id }, args.limit, args.offset);
                return items.map(mappers_1.mapTeam);
            }
        },
        Team: {
            project: async (parent, _args, ctx) => {
                const p = await ctx.services.projects.getById(parent.projectId);
                return (0, mappers_1.mapProject)(p);
            },
            users: async (parent, _args, ctx) => {
                const users = await Promise.all(parent.memberUserIds.map((id) => ctx.services.users.getById(id).catch(() => null)));
                return users.filter((u) => u !== null).map(mappers_1.mapUser);
            }
        },
        Task: {
            project: async (parent, _args, ctx) => {
                const p = await ctx.services.projects.getById(parent.projectId);
                return (0, mappers_1.mapProject)(p);
            },
            assignedUser: async (parent, _args, ctx) => {
                if (!parent.assignedUserId)
                    return null;
                const u = await ctx.services.users.getById(parent.assignedUserId);
                return (0, mappers_1.mapUser)(u);
            },
            tags: async (parent, _args, ctx) => {
                const tags = await Promise.all(parent.tagIds.map((id) => ctx.services.tags.getById(id).catch(() => null)));
                return tags.filter((t) => t !== null).map(mappers_1.mapTag);
            },
            comments: async (parent, args, ctx) => {
                const items = await ctx.services.comments.list({ taskId: parent.id }, args.limit, args.offset);
                return items.map(mappers_1.mapComment);
            }
        },
        Comment: {
            task: async (parent, _args, ctx) => {
                const t = await ctx.services.tasks.getById(parent.taskId);
                return (0, mappers_1.mapTask)(t);
            },
            user: async (parent, _args, ctx) => {
                const u = await ctx.services.users.getById(parent.userId);
                return (0, mappers_1.mapUser)(u);
            }
        },
        Mutation: {
            createCustomer: async (_root, args, ctx) => (0, mappers_1.mapCustomer)(await ctx.services.customers.create(args.input)),
            updateCustomer: async (_root, args, ctx) => (0, mappers_1.mapCustomer)(await ctx.services.customers.update(args.id, args.input)),
            deleteCustomer: async (_root, args, ctx) => {
                await ctx.services.customers.remove(args.id);
                return true;
            },
            createProject: async (_root, args, ctx) => (0, mappers_1.mapProject)(await ctx.services.projects.create(args.input)),
            updateProject: async (_root, args, ctx) => (0, mappers_1.mapProject)(await ctx.services.projects.update(args.id, args.input)),
            deleteProject: async (_root, args, ctx) => {
                await ctx.services.projects.remove(args.id);
                return true;
            },
            createTeam: async (_root, args, ctx) => (0, mappers_1.mapTeam)(await ctx.services.teams.create(args.input)),
            updateTeam: async (_root, args, ctx) => (0, mappers_1.mapTeam)(await ctx.services.teams.update(args.id, args.input)),
            deleteTeam: async (_root, args, ctx) => {
                await ctx.services.teams.remove(args.id);
                return true;
            },
            createUser: async (_root, args, ctx) => (0, mappers_1.mapUser)(await ctx.services.users.create(args.input)),
            updateUser: async (_root, args, ctx) => (0, mappers_1.mapUser)(await ctx.services.users.update(args.id, args.input)),
            deleteUser: async (_root, args, ctx) => {
                await ctx.services.users.remove(args.id);
                return true;
            },
            createTask: async (_root, args, ctx) => (0, mappers_1.mapTask)(await ctx.services.tasks.create(args.input)),
            updateTask: async (_root, args, ctx) => (0, mappers_1.mapTask)(await ctx.services.tasks.update(args.id, args.input)),
            deleteTask: async (_root, args, ctx) => {
                await ctx.services.tasks.remove(args.id);
                return true;
            },
            createTag: async (_root, args, ctx) => (0, mappers_1.mapTag)(await ctx.services.tags.create(args.input)),
            updateTag: async (_root, args, ctx) => (0, mappers_1.mapTag)(await ctx.services.tags.update(args.id, args.input)),
            deleteTag: async (_root, args, ctx) => {
                await ctx.services.tags.remove(args.id);
                return true;
            },
            createComment: async (_root, args, ctx) => (0, mappers_1.mapComment)(await ctx.services.comments.create(args.input)),
            updateComment: async (_root, args, ctx) => (0, mappers_1.mapComment)(await ctx.services.comments.update(args.id, args.input)),
            deleteComment: async (_root, args, ctx) => {
                await ctx.services.comments.remove(args.id);
                return true;
            }
        }
    };
}
//# sourceMappingURL=resolvers.js.map