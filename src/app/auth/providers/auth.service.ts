import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private endPoint = `${environment.apiUrls.openMain}`;
    constructor(private httpClient: HttpClient) { }

    // public login$(credentials: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/login`, credentials);
    // }

    public validate$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/api/auth/validate`);
    }
    public logout$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/api/auth/logout`);
    }
    public user$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/api/auth/user`);
    }

    public userInfo$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/api/auth/user-info`, { params: params });
    }

    public passswordRequest$(id: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/api/auth/user/${id}/passsword-request`, data);
    }

    public forgotPassword$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/api/auth/forgot-password`, data);
    }

    public resetPassword$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/api/auth/reset-password`, data);
    }

    public persona$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/api/auth/persona`);
    }

    public enterprise$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/api/auth/enterprise`);
    }

    // public signup$(data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/signup`, data);
    // }
}
