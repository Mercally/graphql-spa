import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../core/services/customers.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { SettingsService } from '../../core/settings/settings.service';
import { Customer, DashboardCustomer } from '../../core/models/models';
import { RequestCountPanelComponent } from './request-count-panel.component';

/**
 * The core PoC demo (Requirements.md section 4/10): pick a customer, then
 * render Customer -> Projects -> Tasks (AssignedUser/Tags/Comments) and
 * Projects -> Teams -> Users in one screen, side by side with a live count
 * of how many HTTP requests it took — 1 for GraphQL, many for REST.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule, RequestCountPanelComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly customersSvc = inject(CustomersService);
  private readonly dashboardSvc = inject(DashboardService);
  readonly settings = inject(SettingsService);

  readonly customers = signal<Customer[]>([]);
  readonly selectedCustomerId = signal<string>('');
  readonly dashboard = signal<DashboardCustomer | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Re-render the current customer whenever the REST/GraphQL mode or the
    // active backend changes, so the request-count comparison always
    // reflects a fresh fetch instead of a stale count from the prior mode.
    effect(() => {
      this.settings.mode();
      this.settings.backend();
      const id = this.selectedCustomerId();
      if (id) this.fetchDashboard(id);
    });
  }

  ngOnInit(): void {
    this.customersSvc.list({ limit: 20 }).subscribe((result) => {
      this.customers.set(result.items);
      if (result.items.length) this.selectCustomer(result.items[0].id);
    });
  }

  selectCustomer(id: string): void {
    if (!id) return;
    this.selectedCustomerId.set(id);
  }

  private fetchDashboard(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.dashboardSvc.load(id).subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load the dashboard. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
