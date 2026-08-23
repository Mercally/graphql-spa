import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TagsService } from '../../core/services/tags.service';
import { Tag } from '../../core/models/models';

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './tag-detail.component.html'
})
export class TagDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tags = inject(TagsService);

  readonly tag = signal<Tag | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tags.getById(id).subscribe({
      next: (tag) => {
        this.tag.set(tag);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load this tag.');
        this.loading.set(false);
      }
    });
  }
}
