import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlmacenUsuariosService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/almacen-usuarios`);
    }

    public deleteCustom$(almacenId: any, personaId: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${almacenId}/${personaId}`);
    }

    public updateCustom$(almacenId: any, personaId: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/${almacenId}/${personaId}`, data);
    }

    public getMisAlmacenes$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/mis-almacenes`, { params });
    }

}
