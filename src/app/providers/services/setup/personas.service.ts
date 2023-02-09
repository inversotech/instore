import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonasService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/personas`);
    }

    public getDocumentos$(idPersona: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${idPersona}/documentos`);
    }
    public getTelefonos$(idPersona: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${idPersona}/telefonos`);
    }
    public getVirtuals$(idPersona: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${idPersona}/virtuals`);
    }
    public getDireccions$(idPersona: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${idPersona}/direccions`);
    }
}
