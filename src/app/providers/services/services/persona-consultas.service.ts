import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonaConsultasService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/persona-consultas`);
    }

    public searchContribuyente$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/search-contribuyente`, { params: params });
    }

    public searchClientesToFactura$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/search-clientes-to-factura`, { params: params });
    }

    public searchClientesToBoleta$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/search-clientes-to-boleta`, { params: params });
    }

    public searchClientesToPay$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/search-clientes-to-pay`, { params: params });
    }

    public getRuc$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/validar-ruc`, { params: params });
    }

    public getDni$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/validar-dni`, { params: params });
    }

    public getNoDomiciliado$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/validar-no-domicialido`, { params: params });
    }
}
