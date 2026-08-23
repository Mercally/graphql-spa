import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RequestCounterService } from '../counters/request-counter.service';

/** Counts every outgoing REST call so the dashboard can show a real, live request count. */
export const restCountInterceptor: HttpInterceptorFn = (req, next) => {
  const counter = inject(RequestCounterService);
  counter.recordRest(`${req.method} ${req.urlWithParams.replace(/^https?:\/\/[^/]+/, '')}`);
  return next(req);
};
