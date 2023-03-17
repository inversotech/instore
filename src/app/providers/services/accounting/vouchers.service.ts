import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VouchersService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/vouchers`);
    }

    public getToFilterAll$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/to-filters`, { params: params });
    }
}
