import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { RequestCounterService } from '../counters/request-counter.service';
import { DashboardRestService } from './dashboard-rest.service';
import { DashboardGraphqlService } from './dashboard-graphql.service';
import { DashboardCustomer } from '../models/models';

/** Facade the dashboard component uses; resets the request counter, then
 *  runs whichever strategy (REST chain vs single GraphQL query) is active. */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly restSvc = inject(DashboardRestService);
  private readonly gqlSvc = inject(DashboardGraphqlService);
  private readonly settings = inject(SettingsService);
  private readonly counter = inject(RequestCounterService);

  load(customerId: string): Observable<DashboardCustomer> {
    this.counter.reset();
    return this.settings.mode() === 'rest'
      ? this.restSvc.getDashboard(customerId)
      : this.gqlSvc.getDashboard(customerId);
  }
}
