import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../core/services/teams.service';
import { Team } from '../../core/models/models';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-list.component.html'
})
export class TeamListComponent implements OnInit {
  private readonly teams = inject(TeamsService);

  readonly items = signal<Team[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.teams.list({ limit: 50 }).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load teams. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
