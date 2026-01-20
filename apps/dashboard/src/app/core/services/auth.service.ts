import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {
    public currentUser = signal<any | null>(null);
    private accessToken = signal<string | null>(null);

    constructor(private http: HttpClient) {
        const token = localStorage.getItem('token');

        if (token) {
            this.accessToken.set(token);

            this.validateToken().subscribe({
                next: res => {
                    this.currentUser.set(res.user);
                },
                error: () => {
                    this.logout();
                }
            })
        }   
    }

    register(userData: any) {
        return this.http.post(environment.apiUrl + "/api/auth/register", userData);
    }

    login(user: any) {
        return this.http.post<any>(environment.apiUrl + '/api/auth/login', user, { withCredentials: true }).pipe(
            tap(res => {
                this.currentUser.set(res.user);
            })
        );
    }

    logout() {
        localStorage.clear();
        this.currentUser.set(null);
        this.accessToken.set(null);
    }

    validateToken() {
        return this.http.get<any>(environment.apiUrl + '/api/auth/me', { withCredentials: true });
    }

    isAuthenticated() {
        return !!this.currentUser() && !!this.accessToken();
    }

    getCurrentUser() { return this.currentUser(); }

    getAccessToken() { return this.accessToken(); }

    refreshAccessToken() {
        return this.http.post<{ accessToken: string }>(
            environment.apiUrl + '/api/auth/refresh',
            {},
            { withCredentials: true }
        ).pipe(
            tap(res => this.accessToken.set(res.accessToken))
        );
    }
}