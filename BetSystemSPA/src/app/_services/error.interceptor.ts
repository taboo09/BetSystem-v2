import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HTTP_INTERCEPTORS, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
              if (error instanceof HttpErrorResponse) {
              const applicationError = error.headers.get('Application-Error');
              const status = error.status;
              if (applicationError) {
                return throwError(applicationError);
              }
              const serverError = error.error;
              let modelStateError = '';
              if (status === 0) modelStateError = 'Server is not responding';
              if (status === 500) modelStateError = 'Server Error';
              else if (serverError && typeof serverError === 'object'){
                for (const key in serverError.errors){
                  if (serverError.errors[key]) {
                    modelStateError += serverError.errors[key] + '\n';
                  }
                }
              }
              return throwError(modelStateError || serverError || 'Server Error');
            }
        })
    );
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};