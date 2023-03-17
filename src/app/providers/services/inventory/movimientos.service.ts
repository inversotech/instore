import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientosService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/movimientos`);
    }

    public addBetweenWarehouses$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/between-warehouses`, data);
    }

   
    public finalizeBetweenWarehouses$(movimientoId: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/between-warehouses/${movimientoId}/finalize`, data);
    }

    public finalize$(movimientoId: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/${movimientoId}/finalize`, data);
    }

    public enable$(id: any, params: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/${id}/enable`, { params: params });
    }
}
