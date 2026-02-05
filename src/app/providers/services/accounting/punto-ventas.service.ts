import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PuntoVentasService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/sales/punto-ventas`);
    }

    // public onDeleteCustomer$(id_punto_venta: any): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.endPoint}/sales/conta-documentos/addordel-assigme`, data);
    // }

    public getDocumentosByPuntoVenta$(id_punto_venta: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${id_punto_venta}/documentos`);
    }

    public addDocumentosToPuntoVenta$(id_punto_venta: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/${id_punto_venta}/documentos`, data);
    }

    public getDocumentosToAssign$(id_punto_venta: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${id_punto_venta}/documentos-to-assign`);
    }

    public deleteDocumentosFromPuntoVenta$(id_punto_venta: any, id_conta_documento: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${id_punto_venta}/documentos/${id_conta_documento}`);
    }




    public getAlmacenesToAssign$(id_punto_venta: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${id_punto_venta}/almacenes-to-assign`);
    }
    public addAlmacenesToPuntoVenta$(id_punto_venta: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/${id_punto_venta}/almacenes`, data);
    }



    public getUsuariosByPuntoVenta$(id_punto_venta: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/${id_punto_venta}/users`);
    }
    public addUsersToPuntoVenta$(id_punto_venta: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/${id_punto_venta}/users`, data);
    }
    public deleteUsuariosFromPuntoVenta$(id_punto_venta: any, id_user: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${id_punto_venta}/users/${id_user}`);
    }



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

    // public delete2$(id: any): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.endPoint}/accounting/conta-documentos/${id}`);
    // }

    // public getTipoComprobantes$(): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/accounting/conta-documentos/tipo-comprobantes`);
    // }

    // public getContaDocumentsPadre$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/accounting/conta-documentos/conta-documentos-parent`, { params: params });
    // }



}
