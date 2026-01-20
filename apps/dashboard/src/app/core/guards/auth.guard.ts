import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, of } from "rxjs";

export const authGuard : CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);    

    if (!authService.getAccessToken()) {
        authService.logout();
        return router.parseUrl('/auth/login');     
    }

    return authService.validateToken().pipe(
        map(() => true),
        catchError(() => {
            authService.logout();
            router.navigateByUrl('/auth/login');
            return of(false);
        })
    )
}