import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomersService } from '../../core/services/customers.service';

/** Create/edit form for Customer — exercises createCustomer/updateCustomer in both REST and GraphQL mode. */
@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customers = inject(CustomersService);

  readonly customerId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.customerId.set(id);
    this.customers.getById(id).subscribe((customer) =>
      this.form.setValue({ name: customer.name, email: customer.email })
    );
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set(null);
    const value = this.form.getRawValue();
    const id = this.customerId();
    const request$ = id ? this.customers.update(id, value) : this.customers.create(value);
    request$.subscribe({
      next: (customer) => this.router.navigate(['/customers', customer.id]),
      error: () => {
        this.error.set('Save failed. Check the console/network tab for details.');
        this.saving.set(false);
      }
    });
  }
}
