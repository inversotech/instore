import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EmailService {
    private endPoint = `${environment.apiUrls.openAccounting}/api/auth/email`;
    constructor(private httpClient: HttpClient) { }

    public verificationNotification$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/verification-notification`, data);
    }
}
