import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TeamsService } from '../../core/services/teams.service';
import { UsersService } from '../../core/services/users.service';
import { Team, User } from '../../core/models/models';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './team-detail.component.html'
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly teamsSvc = inject(TeamsService);
  private readonly usersSvc = inject(UsersService);

  readonly team = signal<Team | null>(null);
  readonly members = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.teamsSvc.getById(id).subscribe({
      next: (team) => {
        this.team.set(team);
        this.loading.set(false);
        // GraphQL mode already nested `users` in one call; REST mode needs one call per member.
        if (team.users) {
          this.members.set(team.users);
        } else if (team.memberUserIds.length) {
          forkJoin(team.memberUserIds.map((userId) => this.usersSvc.getById(userId))).subscribe((users) =>
            this.members.set(users)
          );
        } else {
          this.members.set([]);
        }
      },
      error: () => {
        this.error.set('Could not load this team.');
        this.loading.set(false);
      }
    });
  }
}
