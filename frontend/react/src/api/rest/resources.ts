import { createRestResource } from './resource';
import type { Customer, Project, Team, User, Task, Tag, Comment } from '../../types/entities';

export interface CustomerInput {
  name: string;
  email: string;
}

export interface ProjectInput {
  name: string;
  description?: string;
  customerId: string;
  status: string;
}

export interface TeamInput {
  name: string;
  projectId: string;
  memberUserIds?: string[];
}

export interface UserInput {
  name: string;
  email: string;
  role: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  projectId: string;
  status: string;
  assignedUserId?: string | null;
  tagIds?: string[];
}

export interface TagInput {
  name: string;
  color: string;
}

export interface CommentInput {
  text: string;
  taskId: string;
  userId: string;
}

export const customersResource = createRestResource<Customer, CustomerInput, Partial<CustomerInput>>(
  'customers'
);
export const projectsResource = createRestResource<Project, ProjectInput, Partial<ProjectInput>>(
  'projects'
);
export const teamsResource = createRestResource<Team, TeamInput, Partial<TeamInput>>('teams');
export const usersResource = createRestResource<User, UserInput, Partial<UserInput>>('users');
export const tasksResource = createRestResource<Task, TaskInput, Partial<TaskInput>>('tasks');
export const tagsResource = createRestResource<Tag, TagInput, Partial<TagInput>>('tags');
export const commentsResource = createRestResource<Comment, CommentInput, Partial<CommentInput>>(
  'comments'
);
