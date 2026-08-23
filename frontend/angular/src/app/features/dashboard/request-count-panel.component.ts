import { Component, inject } from '@angular/core';
import { RequestCounterService } from '../../core/counters/request-counter.service';
import { SettingsService } from '../../core/settings/settings.service';

/**
 * Small, always-visible panel showing exactly how many real HTTP requests
 * rendered the dashboard — the numbers come from the REST interceptor / the
 * Apollo counting link (see core/http and core/graphql), not a hardcoded
 * value. This is the concrete, reproducible "many requests vs one query"
 * demonstration called for in Requirements.md section 4/19.
 */
@Component({
  selector: 'app-request-count-panel',
  standalone: true,
  templateUrl: './request-count-panel.component.html'
})
export class RequestCountPanelComponent {
  readonly counter = inject(RequestCounterService);
  readonly settings = inject(SettingsService);
}
