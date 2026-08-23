import { describe, it, expect, beforeEach } from 'vitest';
import { ObjectId } from 'mongodb';
import { TaskService } from '../../src/services/task.service';
import { TaskRepository } from '../../src/repositories/task.repository';
import { ProjectRepository } from '../../src/repositories/project.repository';
import { UserRepository } from '../../src/repositories/user.repository';
import { TagRepository } from '../../src/repositories/tag.repository';
import { Task, Project, User } from '../../src/models/entities';
import { NotFoundError } from '../../src/errors';

function createFakeTaskRepo() {
  const store = new Map<string, Task>();
  return {
    findById: async (id: ObjectId) => store.get(id.toHexString()) ?? null,
    findFiltered: async (filter: { projectId?: ObjectId; status?: string }) =>
      Array.from(store.values()).filter((t) => {
        if (filter.projectId && !t.projectId.equals(filter.projectId)) return false;
        if (filter.status && t.status !== filter.status) return false;
        return true;
      }),
    countFiltered: async () => store.size,
    insert: async (doc: Task) => {
      const _id = new ObjectId();
      const saved = { ...doc, _id };
      store.set(_id.toHexString(), saved);
      return saved;
    },
    updateById: async (id: ObjectId, update: Partial<Task>) => {
      const existing = store.get(id.toHexString());
      if (!existing) return null;
      const updated = { ...existing, ...update };
      store.set(id.toHexString(), updated);
      return updated;
    },
    deleteById: async (id: ObjectId) => store.delete(id.toHexString())
  } as unknown as TaskRepository;
}

describe('TaskService', () => {
  let project: Project;
  let user: User;
  let taskService: TaskService;

  beforeEach(() => {
    project = {
      _id: new ObjectId(),
      name: 'Website Revamp',
      description: '',
      customerId: new ObjectId(),
      status: 'InProgress',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    user = {
      _id: new ObjectId(),
      name: 'Jane Dev',
      email: 'jane@example.com',
      role: 'Developer',
      createdAt: new Date()
    };

    const projectRepo = {
      findById: async (id: ObjectId) => (id.equals(project._id) ? project : null)
    } as unknown as ProjectRepository;
    const userRepo = {
      findById: async (id: ObjectId) => (id.equals(user._id) ? user : null),
      findByIds: async (ids: ObjectId[]) => (ids.every((i) => i.equals(user._id)) ? [user] : [])
    } as unknown as UserRepository;
    const tagRepo = {
      findByIds: async () => []
    } as unknown as TagRepository;

    taskService = new TaskService(createFakeTaskRepo(), projectRepo, userRepo, tagRepo);
  });

  it('rejects creating a task for a non-existent project', async () => {
    await expect(
      taskService.create({
        title: 'Do something',
        description: '',
        projectId: new ObjectId().toHexString(),
        status: 'Todo'
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('creates a task and assigns an existing user', async () => {
    const task = await taskService.create({
      title: 'Implement login',
      description: 'OAuth login flow',
      projectId: project._id.toHexString(),
      status: 'Todo',
      assignedUserId: user._id.toHexString()
    });

    expect(task.title).toBe('Implement login');
    expect(task.assignedUserId?.toHexString()).toBe(user._id.toHexString());
  });

  it('filters tasks by status', async () => {
    await taskService.create({
      title: 'Task A',
      description: '',
      projectId: project._id.toHexString(),
      status: 'Todo'
    });
    await taskService.create({
      title: 'Task B',
      description: '',
      projectId: project._id.toHexString(),
      status: 'Done'
    });

    const { items } = await taskService.list({ status: 'Done' });
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Task B');
  });
});
