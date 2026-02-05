import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContaVoucherConfigsService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/accounting/conta-voucher-configs`);
    }

    // // Para ventas uso cotidiano
    // public onAddOrDeletessigme$(data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/sales/conta-documentos/addordel-assigme`, data);
    // }

    // public getByQuery1$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/sales/conta-documentos`, { params: params });
    // }


    // // Para configuracion contable
    // public getByQuery2$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/accounting/conta-documentos`, { params: params });
    // }

    // public update2$(id: any, data: any): Observable<any> {
    //     return this.httpClient.put<any>(`${this.endPoint}/accounting/conta-documentos/${id}`, data);
    // }

    // public add2$(data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/accounting/conta-documentos`, data);
    // }
    public getTipoAsientos$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-asientos`);
    }

    public getTipoVouchers$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-vouchers`);
    }

    public delete2$(id_empresa: any, id_tipo_voucher: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${id_empresa}/${id_tipo_voucher}`);
    }

    public update2$(id_empresa: any, id_tipo_voucher: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/${id_empresa}/${id_tipo_voucher}`, data);
    }

    // public getTipoComprobantes$(): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/accounting/conta-documentos/tipo-comprobantes`);
    // }

    // public getContaDocumentsPadre$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/accounting/conta-documentos/conta-documentos-parent`, { params: params });
    // }



}
