import { Db } from 'mongodb';
import { CustomerRepository } from '../repositories/customer.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { TeamRepository } from '../repositories/team.repository';
import { UserRepository } from '../repositories/user.repository';
import { TaskRepository } from '../repositories/task.repository';
import { TagRepository } from '../repositories/tag.repository';
import { CommentRepository } from '../repositories/comment.repository';

import { CustomerService } from './customer.service';
import { ProjectService } from './project.service';
import { TeamService } from './team.service';
import { UserService } from './user.service';
import { TaskService } from './task.service';
import { TagService } from './tag.service';
import { CommentService } from './comment.service';

/**
 * Single service container built once per process from the shared Mongo `Db`.
 * Both the REST routes and the GraphQL resolvers depend on this container so
 * business logic (validation, cross-entity checks) lives in exactly one place.
 */
export interface Services {
  customers: CustomerService;
  projects: ProjectService;
  teams: TeamService;
  users: UserService;
  tasks: TaskService;
  tags: TagService;
  comments: CommentService;
  repos: {
    customers: CustomerRepository;
    projects: ProjectRepository;
    teams: TeamRepository;
    users: UserRepository;
    tasks: TaskRepository;
    tags: TagRepository;
    comments: CommentRepository;
  };
}

export function buildServices(db: Db): Services {
  const repos = {
    customers: new CustomerRepository(db),
    projects: new ProjectRepository(db),
    teams: new TeamRepository(db),
    users: new UserRepository(db),
    tasks: new TaskRepository(db),
    tags: new TagRepository(db),
    comments: new CommentRepository(db)
  };

  return {
    repos,
    customers: new CustomerService(repos.customers),
    projects: new ProjectService(repos.projects, repos.customers),
    teams: new TeamService(repos.teams, repos.projects, repos.users),
    users: new UserService(repos.users),
    tasks: new TaskService(repos.tasks, repos.projects, repos.users, repos.tags),
    tags: new TagService(repos.tags),
    comments: new CommentService(repos.comments, repos.tasks, repos.users)
  };
}
