import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
    public currentUser = signal<any|null>(null);
    private accessToken = signal<string|null>(null);

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');        

        if (savedUser) this.currentUser.set(JSON.parse(savedUser));
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
    }

    isAuthenticated() {
        return !!this.currentUser() && !!this.accessToken();
    }

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