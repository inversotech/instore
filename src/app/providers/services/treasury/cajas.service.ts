import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CajasService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/incomes/cajas`);
    }



    public getContaMonedas$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/conta-monedas`);
    }
    public getContaDocumentos$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/conta-documentos`);
    }
    public getMedioPagos$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/medio-pagos`);
    }
    // public getCajasByPuntoVenta$(id_punto_venta: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/${id_punto_venta}/cajas`);
    // }
    // public addCajasToPuntoVenta$(id_punto_venta: any, data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/${id_punto_venta}/cajas`, data);
    // }
    // public updateCajasToPuntoVenta$(id_punto_venta: any, id_caja: any, data: any): Observable<any> {
    //     return this.httpClient.put<any>(`${this.endPoint}/${id_punto_venta}/cajas/${id_caja}`, data);
    // }
    // public deleteCajasFromPuntoVenta$(id_punto_venta: any, id_caja: any): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.endPoint}/${id_punto_venta}/cajas/${id_caja}`);
    // }



}
