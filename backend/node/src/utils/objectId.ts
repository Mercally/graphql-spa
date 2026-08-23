import { ObjectId } from 'mongodb';
import { ValidationError } from '../errors';

export function toObjectId(id: string, fieldName = 'id'): ObjectId {
  if (!ObjectId.isValid(id)) {
    throw new ValidationError(`Invalid ${fieldName}: '${id}' is not a valid ObjectId`);
  }
  return new ObjectId(id);
}

export function toObjectIds(ids: string[] | undefined, fieldName = 'ids'): ObjectId[] {
  if (!ids) return [];
  return ids.map((id) => toObjectId(id, fieldName));
}
