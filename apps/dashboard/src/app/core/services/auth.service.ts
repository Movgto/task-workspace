import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AuthService {
    private currentUser = signal<any|null>(null);

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');

        if (savedUser) this.currentUser.set(JSON.parse(savedUser));
    }

    login(user: any) {
        this.http.post<any>('/api/auth/login', user).subscribe({
            next: res => {
                localStorage.setItem('user', res.user);
                localStorage.setItem('token', res.token);

                this.currentUser.set(res.user);
            }
        });
    }

    logout() {
        localStorage.clear();
        this.currentUser.set(null);
    }
}