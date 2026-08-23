import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CustomersService } from '../../core/services/customers.service';
import { ProjectsService } from '../../core/services/projects.service';
import { Customer, Project } from '../../core/models/models';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customers = inject(CustomersService);
  private readonly projects = inject(ProjectsService);

  readonly customer = signal<Customer | null>(null);
  readonly projectList = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.customers.getById(id).subscribe({
      next: (customer) => {
        this.customer.set(customer);
        this.loading.set(false);
        this.projects.list({ customerId: id, limit: 50 }).subscribe((result) => this.projectList.set(result.items));
      },
      error: () => {
        this.error.set('Could not load this customer.');
        this.loading.set(false);
      }
    });
  }

  deleteCustomer(): void {
    const customer = this.customer();
    if (!customer || !confirm(`Delete customer "${customer.name}"?`)) return;
    this.customers.remove(customer.id).subscribe(() => this.router.navigate(['/customers']));
  }
}
