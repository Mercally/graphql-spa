import { FastifyInstance } from 'fastify';
import { Services } from '../services';
import { customerRoutes } from './routes/customers.routes';
import { projectRoutes } from './routes/projects.routes';
import { teamRoutes } from './routes/teams.routes';
import { userRoutes } from './routes/users.routes';
import { taskRoutes } from './routes/tasks.routes';
import { tagRoutes } from './routes/tags.routes';
import { commentRoutes } from './routes/comments.routes';

export async function registerRestRoutes(app: FastifyInstance, services: Services): Promise<void> {
  await app.register(customerRoutes(services), { prefix: '/api/customers' });
  await app.register(projectRoutes(services), { prefix: '/api/projects' });
  await app.register(teamRoutes(services), { prefix: '/api/teams' });
  await app.register(userRoutes(services), { prefix: '/api/users' });
  await app.register(taskRoutes(services), { prefix: '/api/tasks' });
  await app.register(tagRoutes(services), { prefix: '/api/tags' });
  await app.register(commentRoutes(services), { prefix: '/api/comments' });
}
