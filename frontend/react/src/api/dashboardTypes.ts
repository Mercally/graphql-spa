/**
 * Shared shape both the REST orchestrator (api/rest/dashboard.ts) and the
 * GraphQL query (api/graphql/dashboard.ts) resolve into, so DashboardPage can
 * render either without caring which mode produced the data.
 */
export interface DashboardUserRef {
  id: string;
  name: string;
}

export interface DashboardTagRef {
  id: string;
  name: string;
}

export interface DashboardCommentRef {
  id: string;
  text: string;
}

export interface DashboardTask {
  id: string;
  title: string;
  status: string;
  assignedUser: DashboardUserRef | null;
  tags: DashboardTagRef[];
  comments: DashboardCommentRef[];
}

export interface DashboardTeam {
  id: string;
  name: string;
  users: DashboardUserRef[];
}

export interface DashboardProject {
  id: string;
  name: string;
  status: string;
  tasks: DashboardTask[];
  teams: DashboardTeam[];
}

export interface DashboardCustomer {
  id: string;
  name: string;
  projects: DashboardProject[];
}
