import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SalesService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/sales`);
    }

    public getCuentaBancarias$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/cuenta-bancarias`, { params: params });
    }

    public getTipoTarjetas$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-tarjetas`, { params: params });
    }

    public getSalesFinalized$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/sales-finalized`, { params: params });
    }

    public getSalesNoFinalized$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/sales-no-finalized`, { params: params });
    }
    public getMisContaDocumentos$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/common/mis-conta-documentos`, { params: params });
    }

    public getTipoIgvs$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-igvs`, { params: params });
    }

    public addSale$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/sales`, data);
    }

    public anularSale$(idVenta: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/sales/${idVenta}/anular`);
    }

    public finalizarSale$(idVenta: any, data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/sales/${idVenta}/finalizar`, data);
    }

    public updateSale$(idVenta: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/sales/${idVenta}`, data);
    }

    public getSaleById$(idVenta: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/sales/${idVenta}`);
    }

    public deleteSale$(idVenta: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/sales/${idVenta}`);
    }

    public searchArticuloToVenta$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/sales/search-articulo-to-venta`, { params: params });
    }


    public addSaleDetalle$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/sales-detail`, data);
    }

    public updateSaleDetalleTipoIgv$(idVentaDetalle: any, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/sales-detail/${idVentaDetalle}/tipo-igv`, data);
    }

    public getSaleDetalleById$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/sales-detail`, { params: params });
    }

    public deleteSaleDetalle$(idVentaDetalle: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/sales-detail/${idVentaDetalle}`);
    }


    public getMisCajaCajasParaVentas$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/mis-cajas-habilitadas-para-ventas`, { params: params });
    }

}
