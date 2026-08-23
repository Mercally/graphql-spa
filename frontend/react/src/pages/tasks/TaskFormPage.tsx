import { useNavigate, useParams } from 'react-router-dom';
import { TaskForm } from '../../components/forms/TaskForm';
import { useTask, useTaskMutations } from '../../hooks/useTasks';
import { LoadingState } from '../../components/common/StateViews';
import type { TaskMutationInput } from '../../api/graphql/tasks';
import type { Task } from '../../types/entities';

export function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { item, loading } = useTask(id);
  const { create, update } = useTaskMutations();

  if (isEdit && loading) return <LoadingState />;

  async function handleSubmit(input: TaskMutationInput) {
    if (isEdit && id) {
      await update(id, input);
      navigate(`/tasks/${id}`);
    } else {
      const created = (await create(input)) as Task;
      navigate(`/tasks/${created.id}`);
    }
  }

  const initial: TaskMutationInput | undefined = item
    ? {
        title: item.title,
        description: item.description,
        projectId: item.projectId,
        status: item.status,
        assignedUserId: item.assignedUserId,
        tagIds: item.tagIds,
      }
    : undefined;

  return (
    <section>
      <h2>{isEdit ? 'Edit Task' : 'New Task'}</h2>
      <TaskForm initial={initial} onSubmit={handleSubmit} submitLabel={isEdit ? 'Save' : 'Create'} />
    </section>
  );
}
