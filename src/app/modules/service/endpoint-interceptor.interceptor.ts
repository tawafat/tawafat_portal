import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EndpointInterceptorInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const modifiedRequest = request.clone({
            setHeaders: {
                'client-platform': 'angular'
            }
        });

        return next.handle(modifiedRequest);
    }
}
