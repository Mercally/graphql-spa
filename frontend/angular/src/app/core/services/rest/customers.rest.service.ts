import { Injectable } from '@angular/core';
import { BaseRestService } from './base-rest.service';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../../models/models';

@Injectable({ providedIn: 'root' })
export class CustomersRestService extends BaseRestService<
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput
> {
  protected readonly path = 'customers';
}
