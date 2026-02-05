import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContaAnhoConfigsService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/accounting/conta-anho-configs`);
    }

    
    public getTipoAsientos$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-asientos`, { params });
    }

    public getAnhoConfigs$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/anho-configs`, { params });
    }

    public getMesConfigs$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/mes-configs`, { params });
    }

    public addAnhoConfig$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/anho-configs`, data);
    }

    public addMesConfig$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/mes-configs`, data);
    }


    public changeEstadoAnhoConfig$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/change-estado-anho-configs`, data);
    }
    public changeEstadoMesConfig$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/change-estado-mes-configs`, data);
    }
}
