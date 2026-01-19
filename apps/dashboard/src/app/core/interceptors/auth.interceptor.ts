import type { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, map, Observable, switchMap, throwError } from "rxjs";

export class AuthInterceptor implements HttpInterceptor {
    private authService = inject(AuthService);
    
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getAccessToken();
        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(req).pipe(
            catchError(err => {
                if (err.status === 401 && !req.url.includes('/auth')) {
                    return this.authService.refreshAccessToken().pipe(
                        map(res => {
                            const newReq = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${res.accessToken}`
                                }
                            })

                            return next.handle(newReq);
                        }),
                        catchError(() => {
                            this.authService.logout();
                            return throwError(() => err);
                        })
                    )
                }

                return throwError(() => err);
            })
        ) as Observable<HttpEvent<any>>;
    }

}