import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },

  {
    path: 'customers',
    loadComponent: () =>
      import('./features/customers/customer-list.component').then((m) => m.CustomerListComponent)
  },
  {
    path: 'customers/new',
    loadComponent: () =>
      import('./features/customers/customer-form.component').then((m) => m.CustomerFormComponent)
  },
  {
    path: 'customers/:id/edit',
    loadComponent: () =>
      import('./features/customers/customer-form.component').then((m) => m.CustomerFormComponent)
  },
  {
    path: 'customers/:id',
    loadComponent: () =>
      import('./features/customers/customer-detail.component').then((m) => m.CustomerDetailComponent)
  },

  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/project-list.component').then((m) => m.ProjectListComponent)
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./features/projects/project-detail.component').then((m) => m.ProjectDetailComponent)
  },

  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/task-list.component').then((m) => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./features/tasks/task-form.component').then((m) => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./features/tasks/task-form.component').then((m) => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id',
    loadComponent: () => import('./features/tasks/task-detail.component').then((m) => m.TaskDetailComponent)
  },

  {
    path: 'teams',
    loadComponent: () => import('./features/teams/team-list.component').then((m) => m.TeamListComponent)
  },
  {
    path: 'teams/:id',
    loadComponent: () => import('./features/teams/team-detail.component').then((m) => m.TeamDetailComponent)
  },

  {
    path: 'users',
    loadComponent: () => import('./features/users/user-list.component').then((m) => m.UserListComponent)
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./features/users/user-detail.component').then((m) => m.UserDetailComponent)
  },

  {
    path: 'tags',
    loadComponent: () => import('./features/tags/tag-list.component').then((m) => m.TagListComponent)
  },
  {
    path: 'tags/:id',
    loadComponent: () => import('./features/tags/tag-detail.component').then((m) => m.TagDetailComponent)
  },

  {
    path: 'comments',
    loadComponent: () =>
      import('./features/comments/comment-list.component').then((m) => m.CommentListComponent)
  },
  {
    path: 'comments/:id',
    loadComponent: () =>
      import('./features/comments/comment-detail.component').then((m) => m.CommentDetailComponent)
  },

  { path: '**', redirectTo: 'dashboard' }
];
