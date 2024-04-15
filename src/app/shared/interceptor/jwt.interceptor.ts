import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LoadingService } from '../data/loading-service';

export const JwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const _loading = inject(LoadingService);
  const currentUserToken = JSON.parse(window.localStorage.getItem(`Private Key for My EMR_token`) as string) ?? null //authenticationService.currentUserValue //;
  _loading.setLoading(true, req.url);
  if (currentUserToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUserToken}`,
      },
    });
    return next(cloned).pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
      if (evt instanceof HttpResponse) {
        _loading.setLoading(false, req.url);
      }
      return evt;
    }))
  } else {
    _loading.setLoading(false, req.url);
    return next(req);
  }
}
