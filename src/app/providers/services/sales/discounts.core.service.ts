import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountsCoreService {
private baseUrl = "https://app101.adventistas.pe/php80/vopen/dev/open-accounting-api/public/api/discounts";
private endPoint = `${this.baseUrl}/discounts`;
private endPointAplicacion = `${this.baseUrl}/type-application`;
private endPointDiscount = `${this.baseUrl}/type-discounts`;


  constructor(private httpClient: HttpClient) { }

  public listaDescuentos$(params?: any): Observable<any> {
    return this.httpClient.get<any>(this.endPoint, { params });
  }
  public eliminar(id_venta_descuento: any): Observable<any> {
    const url = `${this.endPoint}/${id_venta_descuento}`;
    return this.httpClient.delete<any>(url);
  }
  public crear(data: any): Observable<any> {
    return this.httpClient.post<any>(this.endPoint, data);
  }

  public getTipoAplicacion(params: any): Observable<any> {
    return this.httpClient.get<any>(this.endPointAplicacion, { params });
  }
  public getTipoDiscount(params: any): Observable<any> {
    return this.httpClient.get<any>(this.endPointDiscount, { params });
  }
  public editarDescuento(id_venta_descuento: number, data: any): Observable<any> {
    const url = `${this.endPoint}/${id_venta_descuento}`;
    return this.httpClient.put<any>(url, data);
  }
  public getByIdDescuento(id_venta_descuento: number): Observable<any> {
    const url = `${this.endPoint}/${id_venta_descuento}`;
    return this.httpClient.get<any>(url);
  }
 public getGrupoProductos(id_venta_descuento: any, id_anho: number): Observable<any[]> {
  const url = `https://app101.adventistas.pe/php80/vopen/dev/open-accounting-api/public/api/discounts/${id_venta_descuento}/groups-articles?id_anho=${id_anho}`;
  return this.httpClient.get<any[]>(url);
}
postGrupoProductos(id_descuento: any, payload: any) {
  const url = `https://app101.adventistas.pe/php80/vopen/dev/open-accounting-api/public/api/discounts/${id_descuento}/groups-articles`;
  return this.httpClient.post(url, payload);
}
}


