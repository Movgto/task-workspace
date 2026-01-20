import type { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // Get token and add to Authorization header
    const token = authService.getAccessToken();
    
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true // Include cookies (HttpOnly)
        });
    }

    return next(req).pipe(
        catchError(error => {
            // Handle 401 Unauthorized
            if (error.status === 401 && !req.url.includes('/refresh')) {
                // Try to refresh the token
                return authService.refreshAccessToken().pipe(
                    map(res => {
                        // Retry the original request with new token
                        const newReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${res.accessToken}`
                            }
                        });
                        return next(newReq);
                    }),
                    catchError(refreshError => {
                        // Refresh failed, logout
                        authService.logout();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    ) as Observable<HttpEvent<any>>;
};