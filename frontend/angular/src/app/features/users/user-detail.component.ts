import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly users = inject(UsersService);

  readonly user = signal<User | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.users.getById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load this user.');
        this.loading.set(false);
      }
    });
  }
}
