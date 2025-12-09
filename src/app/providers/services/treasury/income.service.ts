import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IncomeService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/incomes`);
    }

    public getIncomesFinalized$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/incomes-finalized`, { params: params });
    }

    public getIncomesFinalizedToClose$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/incomes-finalized-to-close`, { params: params });
    }


    public getMedioPagos$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/medio-pagos`, { params: params });
    }

    public getMisCajasHabilitadasAbiertas$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/mis-cajas-habilitadas-abiertas`, { params: params });
    }

    public getMisCajasHabilitadasAll$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/mis-cajas-habilitadas-all`, { params: params });
    }

    public cerrarCaja$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/cajas/cerrar`, data);
    }

    public saveDepositoFromCaja$(data: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}/depositos/save-deposito-fromcaja`, data);
    }

    // public getIncomesNoFinalized$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/incomes-no-finalized`, { params: params });
    // }
    // public getMisContaDocumentos$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/common/mis-conta-documentos`, { params: params });
    // }

    // public getTipoIgvs$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/tipo-igvs`, { params: params });
    // }

    // public addIncome$(data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/incomes`, data);
    // }

    public anularIncome$(idDeposito: any): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/incomes/${idDeposito}/anular`);
    }

    // public finalizarIncome$(idVenta: any, data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/incomes/${idVenta}/finalizar`, data);
    // }

    // public updateIncome$(idVenta: any, data: any): Observable<any> {
    //     return this.httpClient.put<any>(`${this.endPoint}/incomes/${idVenta}`, data);
    // }

    // public getIncomeById$(idVenta: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/incomes/${idVenta}`);
    // }

    // public deleteIncome$(idVenta: any): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.endPoint}/incomes/${idVenta}`);
    // }

    // public searchArticuloToVenta$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/incomes/search-articulo-to-venta`, { params: params });
    // }


    // public addIncomeDetalle$(data: any): Observable<any> {
    //     return this.httpClient.post<any>(`${this.endPoint}/incomes-detail`, data);
    // }

    // public updateIncomeDetalleTipoIgv$(idVentaDetalle: any, data: any): Observable<any> {
    //     return this.httpClient.put<any>(`${this.endPoint}/incomes-detail/${idVentaDetalle}/tipo-igv`, data);
    // }

    // public getIncomeDetalleById$(params: any): Observable<any> {
    //     return this.httpClient.get<any>(`${this.endPoint}/incomes-detail`, { params: params });
    // }

    // public deleteIncomeDetalle$(idVentaDetalle: any): Observable<any> {
    //     return this.httpClient.delete<any>(`${this.endPoint}/incomes-detail/${idVentaDetalle}`);
    // }

    public getCuentasPorCobrar$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/cuentas-por-cobrar`, { params: params });
    }

    public getCuentaBancarias$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/cuenta-bancarias`, { params: params });
    }
    public getTipoTarjetas$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/tipo-tarjetas`, { params: params });
    }
}
