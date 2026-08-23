import { useState, type FormEvent } from 'react';
import { useProjectsList } from '../../hooks/useProjects';
import { useUsersList } from '../../hooks/useUsers';
import { useTagsList } from '../../hooks/useTags';
import { TASK_STATUSES } from '../../types/entities';
import type { TaskMutationInput } from '../../api/graphql/tasks';

interface TaskFormProps {
  initial?: TaskMutationInput;
  onSubmit: (input: TaskMutationInput) => Promise<unknown>;
  submitLabel: string;
}

export function TaskForm({ initial, onSubmit, submitLabel }: TaskFormProps) {
  const { items: projects } = useProjectsList();
  const { items: users } = useUsersList(1, 500);
  const { items: tags } = useTagsList(1, 500);

  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [projectId, setProjectId] = useState(initial?.projectId ?? '');
  const [status, setStatus] = useState(initial?.status ?? TASK_STATUSES[0]);
  const [assignedUserId, setAssignedUserId] = useState(initial?.assignedUserId ?? '');
  const [tagIds, setTagIds] = useState<string[]>(initial?.tagIds ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(tagId: string) {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title,
        description,
        projectId,
        status,
        assignedUserId: assignedUserId || null,
        tagIds,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </label>
      <label>
        Project
        <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Assigned user
        <select value={assignedUserId} onChange={(e) => setAssignedUserId(e.target.value)}>
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Tags</legend>
        <div className="checkbox-grid">
          {tags.map((tag) => (
            <label key={tag.id} className="checkbox-item">
              <input type="checkbox" checked={tagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
              {tag.name}
            </label>
          ))}
        </div>
      </fieldset>
      {error && <p className="state state-error">{error}</p>}
      <button type="submit" className="btn" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
