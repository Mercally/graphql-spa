import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildAppWithServices } from '../../src/app';
import { buildTestServices } from '../helpers/testServices';

describe('REST /api/customers', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildAppWithServices(buildTestServices(), { logger: false });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 201 and the created resource on POST', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/customers',
      payload: { name: 'Acme Corp', email: 'acme@example.com' }
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.name).toBe('Acme Corp');
    expect(body.id).toBeDefined();
  });

  it('lists created customers on GET', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/customers',
      payload: { name: 'Globex', email: 'globex@example.com' }
    });

    const res = await app.inject({ method: 'GET', url: '/api/customers' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.some((c: { name: string }) => c.name === 'Globex')).toBe(true);
  });

  it('returns 400 on invalid payload', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/customers', payload: { name: '' } });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.statusCode).toBe(400);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/customers/64b64b64b64b64b64b64b64b' });
    expect(res.statusCode).toBe(404);
  });
});
