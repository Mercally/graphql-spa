import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommentsService } from '../../core/services/comments.service';
import { Comment } from '../../core/models/models';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './comment-list.component.html'
})
export class CommentListComponent implements OnInit {
  private readonly comments = inject(CommentsService);

  readonly items = signal<Comment[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.comments.list({ limit: 50 }).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load comments. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
