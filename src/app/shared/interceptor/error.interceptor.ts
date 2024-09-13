import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { LoadingService } from "../data/loading-service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private loading: LoadingService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.loading.setLoading(false, request.url);
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        const error = err?.error || err?.statusText;
        this.loading.setLoading(false, request.url);
        return throwError(error);
      })
    );
  }
}
