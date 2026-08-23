import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksService } from '../../core/services/tasks.service';
import { ProjectsService } from '../../core/services/projects.service';
import { UsersService } from '../../core/services/users.service';
import { TagsService } from '../../core/services/tags.service';
import { Project, Tag, TaskStatus, User } from '../../core/models/models';

const STATUSES: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done'];

/** Create/edit form for Task — exercises createTask/updateTask in both REST and GraphQL mode. */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tasksSvc = inject(TasksService);
  private readonly projectsSvc = inject(ProjectsService);
  private readonly usersSvc = inject(UsersService);
  private readonly tagsSvc = inject(TagsService);

  readonly statuses = STATUSES;
  readonly projectOptions = signal<Project[]>([]);
  readonly userOptions = signal<User[]>([]);
  readonly tagOptions = signal<Tag[]>([]);
  readonly taskId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    projectId: ['', Validators.required],
    status: ['Todo' as TaskStatus, Validators.required],
    assignedUserId: [''],
    tagIds: this.fb.nonNullable.control<string[]>([])
  });

  ngOnInit(): void {
    this.projectsSvc.list({ limit: 100 }).subscribe((r) => this.projectOptions.set(r.items));
    this.usersSvc.list({ limit: 100 }).subscribe((r) => this.userOptions.set(r.items));
    this.tagsSvc.list({ limit: 100 }).subscribe((r) => this.tagOptions.set(r.items));

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.taskId.set(id);
    this.tasksSvc.getById(id).subscribe((task) =>
      this.form.setValue({
        title: task.title,
        description: task.description,
        projectId: task.projectId,
        status: task.status,
        assignedUserId: task.assignedUserId ?? '',
        tagIds: task.tagIds
      })
    );
  }

  onTagsChange(event: Event): void {
    const selected = Array.from((event.target as HTMLSelectElement).selectedOptions).map((o) => o.value);
    this.form.controls.tagIds.setValue(selected);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set(null);
    const value = this.form.getRawValue();
    const payload = { ...value, assignedUserId: value.assignedUserId || null };
    const id = this.taskId();
    const request$ = id ? this.tasksSvc.update(id, payload) : this.tasksSvc.create(payload);
    request$.subscribe({
      next: (task) => this.router.navigate(['/tasks', task.id]),
      error: () => {
        this.error.set('Save failed. Check the console/network tab for details.');
        this.saving.set(false);
      }
    });
  }
}
