import { describe, it, expect, beforeEach } from 'vitest';
import { ObjectId } from 'mongodb';
import { CustomerService } from '../../src/services/customer.service';
import { CustomerRepository } from '../../src/repositories/customer.repository';
import { Customer } from '../../src/models/entities';
import { NotFoundError, ValidationError } from '../../src/errors';

/** Minimal in-memory fake standing in for the Mongo-backed CustomerRepository. */
function createFakeRepo() {
  const store = new Map<string, Customer>();
  return {
    findAll: async () => Array.from(store.values()),
    findById: async (id: ObjectId) => store.get(id.toHexString()) ?? null,
    insert: async (doc: Customer) => {
      const _id = new ObjectId();
      const saved = { ...doc, _id };
      store.set(_id.toHexString(), saved);
      return saved;
    },
    updateById: async (id: ObjectId, update: Partial<Customer>) => {
      const existing = store.get(id.toHexString());
      if (!existing) return null;
      const updated = { ...existing, ...update };
      store.set(id.toHexString(), updated);
      return updated;
    },
    deleteById: async (id: ObjectId) => store.delete(id.toHexString())
  } as unknown as CustomerRepository;
}

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    service = new CustomerService(createFakeRepo());
  });

  it('rejects creation without required fields', async () => {
    await expect(service.create({ name: '', email: '' })).rejects.toBeInstanceOf(ValidationError);
  });

  it('creates and retrieves a customer', async () => {
    const created = await service.create({ name: 'Acme Corp', email: 'acme@example.com' });
    expect(created.name).toBe('Acme Corp');
    expect(created._id).toBeInstanceOf(ObjectId);

    const fetched = await service.getById(created._id.toHexString());
    expect(fetched.email).toBe('acme@example.com');
  });

  it('throws NotFoundError for an unknown id', async () => {
    await expect(service.getById(new ObjectId().toHexString())).rejects.toBeInstanceOf(NotFoundError);
  });

  it('throws ValidationError for a malformed id', async () => {
    await expect(service.getById('not-an-object-id')).rejects.toBeInstanceOf(ValidationError);
  });
});
