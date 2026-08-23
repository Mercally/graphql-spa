import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProjectsService } from '../../core/services/projects.service';
import { Project } from '../../core/models/models';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  private readonly projects = inject(ProjectsService);

  readonly items = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.projects.list({ limit: 50 }).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load projects. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
