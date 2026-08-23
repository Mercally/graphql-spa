import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProjectsService } from '../../core/services/projects.service';
import { TasksService } from '../../core/services/tasks.service';
import { TeamsService } from '../../core/services/teams.service';
import { Project, Task, Team } from '../../core/models/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projects = inject(ProjectsService);
  private readonly tasks = inject(TasksService);
  private readonly teams = inject(TeamsService);

  readonly project = signal<Project | null>(null);
  readonly taskList = signal<Task[]>([]);
  readonly teamList = signal<Team[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.projects.getById(id).subscribe({
      next: (project) => {
        this.project.set(project);
        this.loading.set(false);
        this.tasks.list({ projectId: id, limit: 100 }).subscribe((result) => this.taskList.set(result.items));
        this.teams.list({ projectId: id, limit: 20 }).subscribe((result) => this.teamList.set(result.items));
      },
      error: () => {
        this.error.set('Could not load this project.');
        this.loading.set(false);
      }
    });
  }
}
