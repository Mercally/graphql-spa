/**
 * TypeScript interfaces mirroring docs/mongodb-model.md exactly.
 * These describe the on-disk shape (as read/written via the official `mongodb`
 * driver) shared with the .NET backend against the same MongoDB database.
 */
import { ObjectId } from 'mongodb';

export type ProjectStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';
export type UserRole = 'Developer' | 'Manager' | 'Designer' | 'QA';
export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';

export interface Customer {
  _id: ObjectId;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Project {
  _id: ObjectId;
  name: string;
  description: string;
  customerId: ObjectId;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  _id: ObjectId;
  name: string;
  projectId: ObjectId;
  memberUserIds: ObjectId[];
  createdAt: Date;
}

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Task {
  _id: ObjectId;
  title: string;
  description: string;
  projectId: ObjectId;
  status: TaskStatus;
  assignedUserId: ObjectId | null;
  tagIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  _id: ObjectId;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Comment {
  _id: ObjectId;
  text: string;
  taskId: ObjectId;
  userId: ObjectId;
  createdAt: Date;
}
