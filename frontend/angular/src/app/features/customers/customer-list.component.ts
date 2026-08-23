import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CustomersService } from '../../core/services/customers.service';
import { Customer } from '../../core/models/models';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit {
  private readonly customers = inject(CustomersService);

  readonly items = signal<Customer[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.customers.list({ limit: 50 }).subscribe({
      next: (result) => {
        this.items.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load customers. Is the selected backend running?');
        this.loading.set(false);
      }
    });
  }
}
