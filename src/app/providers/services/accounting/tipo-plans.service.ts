import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TipoPlansService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/accounting/tipo-plans`);
    }
}
