import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
    public currentUser = signal<any|null>(null);

    constructor(private http: HttpClient) {
        const savedUser = localStorage.getItem('user');        

        if (savedUser) this.currentUser.set(JSON.parse(savedUser));
    }

    register(userData: any) {
        return this.http.post(environment.apiUrl + "/api/auth/register", userData);
    }

    login(user: any) {
        const obs = this.http.post<any>(environment.apiUrl + '/api/auth/login', user).pipe(
            tap(res => {
                localStorage.setItem('user', JSON.stringify(res.user));
                localStorage.setItem('token', res.token);

                this.currentUser.set(res.user);
            })
        );
        
        return obs;
    }

    logout() {
        localStorage.clear();
        this.currentUser.set(null);
    }
}