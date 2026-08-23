import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { forkJoin, of, type Observable } from 'rxjs';
import { TasksService } from '../../core/services/tasks.service';
import { UsersService } from '../../core/services/users.service';
import { TagsService } from '../../core/services/tags.service';
import { CommentsService } from '../../core/services/comments.service';
import { Comment, Tag, Task, User } from '../../core/models/models';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './task-detail.component.html'
})
export class TaskDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tasksSvc = inject(TasksService);
  private readonly usersSvc = inject(UsersService);
  private readonly tagsSvc = inject(TagsService);
  private readonly commentsSvc = inject(CommentsService);

  readonly task = signal<Task | null>(null);
  readonly assignedUser = signal<User | null>(null);
  readonly tagList = signal<Tag[]>([]);
  readonly commentList = signal<Comment[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tasksSvc.getById(id).subscribe({
      next: (task) => {
        this.task.set(task);
        this.loading.set(false);
        const user$: Observable<User | null> = task.assignedUserId
          ? this.usersSvc.getById(task.assignedUserId)
          : of(null);
        const tags$ = task.tagIds.length
          ? forkJoin(task.tagIds.map((tagId) => this.tagsSvc.getById(tagId)))
          : of([]);
        user$.subscribe((user) => this.assignedUser.set(user));
        tags$.subscribe((tags) => this.tagList.set(tags));
        this.commentsSvc.list({ taskId: id, limit: 100 }).subscribe((result) => this.commentList.set(result.items));
      },
      error: () => {
        this.error.set('Could not load this task.');
        this.loading.set(false);
      }
    });
  }

  deleteTask(): void {
    const task = this.task();
    if (!task || !confirm(`Delete task "${task.title}"?`)) return;
    this.tasksSvc.remove(task.id).subscribe(() => this.router.navigate(['/tasks']));
  }
}
