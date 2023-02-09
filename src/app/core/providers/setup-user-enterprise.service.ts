import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { EntityDataService } from 'src/app/providers/utils';

@Injectable({ providedIn: 'root' })
// export class SetupUserEnterpriseService {
export class SetupUserEnterpriseService extends EntityDataService<any> {
    // private endPoint = `${environment.apiUrls.openAccounting}/api/setup-user-enterprise`;
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/setup-user-enterprise`);
    }

    public getMisEmpresas$(): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/empresas`);
    }

    public getMisEmpresaSucursales$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/sucursales`, { params: params });
    }
}
