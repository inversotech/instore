import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContaDocumentsService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/sales/conta-documentos`);
    }

    public onAddOrDeletessigme$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/addordel-assigme`, data);
    }


    // public getTipoComprobantes$(): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/tipo-comprobantes`);
    // }

    // public getContaDocumentsPadre$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/conta-documentos-parent`, { params: params });
    // }

}
