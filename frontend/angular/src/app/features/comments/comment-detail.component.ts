import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommentsService } from '../../core/services/comments.service';
import { UsersService } from '../../core/services/users.service';
import { Comment, User } from '../../core/models/models';

@Component({
  selector: 'app-comment-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './comment-detail.component.html'
})
export class CommentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly comments = inject(CommentsService);
  private readonly users = inject(UsersService);

  readonly comment = signal<Comment | null>(null);
  readonly author = signal<User | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.comments.getById(id).subscribe({
      next: (comment) => {
        if (!comment) {
          this.error.set('Comment not found.');
          this.loading.set(false);
          return;
        }
        this.comment.set(comment);
        this.loading.set(false);
        this.users.getById(comment.userId).subscribe((user) => this.author.set(user));
      },
      error: () => {
        this.error.set('Could not load this comment.');
        this.loading.set(false);
      }
    });
  }
}
