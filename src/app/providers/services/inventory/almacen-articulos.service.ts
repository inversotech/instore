import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlmacenArticulosService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/almacen-articulos`);
    }

    public deleteCustom$(anhoId: any, almacenId: any, articuloId: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${anhoId}/${almacenId}/${articuloId}`);
    }

    public updateCustom$(anhoId: any, almacenId: any, articuloId: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/${anhoId}/${almacenId}/${articuloId}`, data);
    }

}
