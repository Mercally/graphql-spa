import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagsService } from '../../core/services/tags.service';
import { Tag } from '../../core/models/models';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tag-list.component.html'
})
export class TagListComponent implements OnInit {
  private readonly tags = inject(TagsService);

  readonly items = signal<Tag[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.tags.list({ limit: 50 }).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tags. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
