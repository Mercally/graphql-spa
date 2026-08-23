/**
 * Maps raw Mongo documents (ObjectId/Date fields) to plain JSON-friendly DTOs
 * (`id: string`, ISO date strings) used by both REST responses and GraphQL
 * field resolvers, so API consumers never see driver-specific types.
 */
import { Customer, Project, Team, User, Task, Tag, Comment } from './models/entities';

export function mapCustomer(c: Customer) {
  return {
    id: c._id.toHexString(),
    name: c.name,
    email: c.email,
    createdAt: c.createdAt.toISOString()
  };
}

export function mapProject(p: Project) {
  return {
    id: p._id.toHexString(),
    name: p.name,
    description: p.description,
    customerId: p.customerId.toHexString(),
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  };
}

export function mapTeam(t: Team) {
  return {
    id: t._id.toHexString(),
    name: t.name,
    projectId: t.projectId.toHexString(),
    memberUserIds: t.memberUserIds.map((id) => id.toHexString()),
    createdAt: t.createdAt.toISOString()
  };
}

export function mapUser(u: User) {
  return {
    id: u._id.toHexString(),
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString()
  };
}

export function mapTask(t: Task) {
  return {
    id: t._id.toHexString(),
    title: t.title,
    description: t.description,
    projectId: t.projectId.toHexString(),
    status: t.status,
    assignedUserId: t.assignedUserId ? t.assignedUserId.toHexString() : null,
    tagIds: t.tagIds.map((id) => id.toHexString()),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString()
  };
}

export function mapTag(t: Tag) {
  return {
    id: t._id.toHexString(),
    name: t.name,
    color: t.color,
    createdAt: t.createdAt.toISOString()
  };
}

export function mapComment(c: Comment) {
  return {
    id: c._id.toHexString(),
    text: c.text,
    taskId: c.taskId.toHexString(),
    userId: c.userId.toHexString(),
    createdAt: c.createdAt.toISOString()
  };
}
