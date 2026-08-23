import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../core/services/tasks.service';
import { Task, TaskStatus } from '../../core/models/models';

const STATUSES: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done'];

/** List with the status filter — demonstrates ?status= (REST) vs tasks(status:) (GraphQL). */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  private readonly tasks = inject(TasksService);

  readonly statuses = STATUSES;
  readonly statusFilter = signal<string>('');
  readonly items = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  onFilterChange(value: string): void {
    this.statusFilter.set(value);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const status = this.statusFilter() || undefined;
    this.tasks.list({ limit: 100, status }).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
