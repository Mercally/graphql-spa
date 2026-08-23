export type ProjectStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';
export type UserRole = 'Developer' | 'Manager' | 'Designer' | 'QA';
export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  customerId: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  projectId: string;
  memberUserIds: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  assignedUserId: string | null;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  taskId: string;
  userId: string;
  createdAt: string;
}

export interface TaskListFilters {
  status?: TaskStatus;
  projectId?: string;
}

export const PROJECT_STATUSES: ProjectStatus[] = ['NotStarted', 'InProgress', 'Completed', 'OnHold'];
export const USER_ROLES: UserRole[] = ['Developer', 'Manager', 'Designer', 'QA'];
export const TASK_STATUSES: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done'];
