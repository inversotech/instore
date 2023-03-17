import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StocksService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/stocks`);
    }

    public getByMes$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/by-mes`, { params });
    }

    public getFull$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/full`, { params });
    }

    public downloadExcel$(params: any): Observable<any> {
        return this.httpClient.get(`${this.endPoint}/download-excel`, { params: params, responseType: 'blob' });
    }
}
