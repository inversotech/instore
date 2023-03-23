import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ArticulosService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/articulos`);
    }

    public addImport$(entity: any): Observable<any> {
        return this.httpClient.post<any>(`${this.endPoint}-import`, entity);
    }

    public getItems$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/items`, { params });
    }
}
