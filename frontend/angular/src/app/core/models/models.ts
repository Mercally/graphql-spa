// Entity shapes mirror docs/mongodb-model.md and the backend DTOs
// (backend/dotnet/src/WorkApi/DTOs, backend/node/src/models). Both REST and
// GraphQL services map their raw responses onto these same interfaces so
// components never need to know which client produced the data.

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type ProjectStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';

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

export type UserRole = 'Developer' | 'Manager' | 'Designer' | 'QA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';

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

/** Normalized list result — hides the fact that .NET REST returns
 *  {items, totalCount, page, pageSize} while Node REST returns a bare array
 *  (or {items, total} for tasks specifically), and GraphQL returns bare arrays. */
export interface ListResult<T> {
  items: T[];
  total: number;
}

export interface TaskFilter {
  status?: string;
  projectId?: string;
  assignedUserId?: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
}
export interface UpdateCustomerInput {
  name?: string;
  email?: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  customerId: string;
  status: ProjectStatus;
}
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

// Shapes for the nested Customer -> Projects -> Tasks/Teams dashboard (the
// core PoC demo). GraphQL fetches this in one query; REST assembles it via
// the request chain documented in docs/graphql-vs-rest.md.
export interface DashboardTask extends Task {
  assignedUser?: User;
  tags?: Tag[];
  comments?: Comment[];
}
export interface DashboardTeam extends Team {
  users?: User[];
}
export interface DashboardProject extends Project {
  tasks?: DashboardTask[];
  teams?: DashboardTeam[];
}
export interface DashboardCustomer extends Customer {
  projects?: DashboardProject[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  assignedUserId?: string | null;
  tagIds?: string[];
}
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedUserId?: string | null;
  tagIds?: string[];
}
