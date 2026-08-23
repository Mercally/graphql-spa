import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BackendId, ClientMode, SettingsService } from '../../core/settings/settings.service';

/** App header: nav links plus the runtime REST/GraphQL + backend toggle. */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly settings = inject(SettingsService);

  readonly navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/customers', label: 'Customers' },
    { path: '/projects', label: 'Projects' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/teams', label: 'Teams' },
    { path: '/users', label: 'Users' },
    { path: '/tags', label: 'Tags' },
    { path: '/comments', label: 'Comments' }
  ];

  onModeChange(value: string): void {
    this.settings.setMode(value as ClientMode);
  }

  onBackendChange(value: string): void {
    this.settings.setBackend(value as BackendId);
  }
}
