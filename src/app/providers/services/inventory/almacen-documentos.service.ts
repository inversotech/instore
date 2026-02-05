import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlmacenDocumentosService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/almacen-documentos`);
    }

    public getTipoOperacions$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-operacions`);
    }

    public getContaDocumentos$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/conta-documentos`, { params: params });
    }

    public deleteCustom$(almacenId: any, id_conta_documento: any, id_tipo_operacion: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${almacenId}/${id_conta_documento}/${id_tipo_operacion}`);
    }

    public updateCustom$(almacenId: any, id_conta_documento: any, id_tipo_operacion: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/${almacenId}/${id_conta_documento}/${id_tipo_operacion}`, data);
    }

    // public getMisAlmacenes$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/mis-almacenes`, { params });
    // }

}
