import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse } from './response';

@Injectable( {
  providedIn: 'root'
})
export class AccessService {
  private url = `${environment.apiUrls.openAccounting}/api/modulos`;

  constructor(private http: HttpClient) { }

  public getActionsByModuloCodigo$(moduloCodigo: string): Observable<IResponse> {
    return this.http.get<IResponse>(`${this.url}/${moduloCodigo}/modulo-accions`);
  }

}
