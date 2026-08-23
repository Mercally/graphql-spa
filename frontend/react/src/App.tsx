import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider } from './config/SettingsContext';
import { GraphQLProvider } from './config/GraphQLProvider';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CustomerListPage } from './pages/customers/CustomerListPage';
import { CustomerDetailPage } from './pages/customers/CustomerDetailPage';
import { CustomerFormPage } from './pages/customers/CustomerFormPage';
import { ProjectListPage } from './pages/projects/ProjectListPage';
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage';
import { TaskListPage } from './pages/tasks/TaskListPage';
import { TaskDetailPage } from './pages/tasks/TaskDetailPage';
import { TaskFormPage } from './pages/tasks/TaskFormPage';
import { TeamListPage } from './pages/teams/TeamListPage';
import { TeamDetailPage } from './pages/teams/TeamDetailPage';
import { UserListPage } from './pages/users/UserListPage';
import { UserDetailPage } from './pages/users/UserDetailPage';
import { TagListPage } from './pages/tags/TagListPage';
import { TagDetailPage } from './pages/tags/TagDetailPage';
import { CommentListPage } from './pages/comments/CommentListPage';
import { CommentDetailPage } from './pages/comments/CommentDetailPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <GraphQLProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />

                <Route path="customers" element={<CustomerListPage />} />
                <Route path="customers/new" element={<CustomerFormPage />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="customers/:id/edit" element={<CustomerFormPage />} />

                <Route path="projects" element={<ProjectListPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />

                <Route path="tasks" element={<TaskListPage />} />
                <Route path="tasks/new" element={<TaskFormPage />} />
                <Route path="tasks/:id" element={<TaskDetailPage />} />
                <Route path="tasks/:id/edit" element={<TaskFormPage />} />

                <Route path="teams" element={<TeamListPage />} />
                <Route path="teams/:id" element={<TeamDetailPage />} />

                <Route path="users" element={<UserListPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />

                <Route path="tags" element={<TagListPage />} />
                <Route path="tags/:id" element={<TagDetailPage />} />

                <Route path="comments" element={<CommentListPage />} />
                <Route path="comments/:id" element={<CommentDetailPage />} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </GraphQLProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
