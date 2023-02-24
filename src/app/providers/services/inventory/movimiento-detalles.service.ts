import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientoDetallesService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/movimiento-detalles`);
    }

    public deleteAll$(movimientoId: string): Observable<any> {
        return this.httpClient.delete<any>(`${this.endPoint}/${movimientoId}/all`);
    }

}
