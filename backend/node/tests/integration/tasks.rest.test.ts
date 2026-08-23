import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildAppWithServices } from '../../src/app';
import { buildTestServices } from '../helpers/testServices';

describe('REST /api/tasks', () => {
  let app: FastifyInstance;
  let projectId: string;

  beforeAll(async () => {
    app = await buildAppWithServices(buildTestServices(), { logger: false });
    await app.ready();

    const customerRes = await app.inject({
      method: 'POST',
      url: '/api/customers',
      payload: { name: 'Initech', email: 'initech@example.com' }
    });
    const customerId = customerRes.json().id;

    const projectRes = await app.inject({
      method: 'POST',
      url: '/api/projects',
      payload: { name: 'Migration', description: 'Legacy migration', customerId, status: 'InProgress' }
    });
    projectId = projectRes.json().id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a task under a valid project', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Write ETL script', description: '', projectId, status: 'Todo' }
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.title).toBe('Write ETL script');
    expect(body.projectId).toBe(projectId);
  });

  it('rejects a task for a non-existent project with 404', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Orphan task', description: '', projectId: '64b64b64b64b64b64b64b64b', status: 'Todo' }
    });
    expect(res.statusCode).toBe(404);
  });

  it('filters tasks by status via query string', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Done task', description: '', projectId, status: 'Done' }
    });

    const res = await app.inject({ method: 'GET', url: `/api/tasks?status=Done&projectId=${projectId}` });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.items.every((t: { status: string }) => t.status === 'Done')).toBe(true);
  });

  it('deletes a task and returns 204', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'Temp task', description: '', projectId, status: 'Todo' }
    });
    const id = created.json().id;

    const del = await app.inject({ method: 'DELETE', url: `/api/tasks/${id}` });
    expect(del.statusCode).toBe(204);

    const getAfterDelete = await app.inject({ method: 'GET', url: `/api/tasks/${id}` });
    expect(getAfterDelete.statusCode).toBe(404);
  });
});
