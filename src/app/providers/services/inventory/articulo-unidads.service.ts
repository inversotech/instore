import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityDataService } from '../../utils';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ArticuloUnidadsService extends EntityDataService<any> {
    constructor(protected override httpClient: HttpClient) {
        super(httpClient, `${environment.apiUrls.openAccounting}/api/articulo-unidads`);
    }

    // GET /articulo-unidads - Listar unidades con precios
    // Filtros: id_articulo, id_almacen, id_lote, sin_precio
    public getUnidadesConPrecios$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}`, { params });
    }

    // GET /articulo-unidads/lotes-by-articulo - Lotes de un articulo con resumen de precios
    public getLotesByArticulo$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/lotes-by-articulo`, { params });
    }

    // GET /articulo-unidads/articulos-sin-precio - Articulos con unidades sin precio
    public getArticulosSinPrecio$(params: any): Observable<any> {
        return this.httpClient.get<any>(`${this.endPoint}/articulos-sin-precio`, { params });
    }

    // PUT /articulo-unidads/{id}/precio - Actualizar precio de una unidad
    public updatePrecioUnidad$(id: number, data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/${id}/precio`, data);
    }

    // PUT /articulo-unidads/precio-by-lote - Actualizar precio de todas las unidades de un lote
    public updatePrecioByLote$(data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/precio-by-lote`, data);
    }

    // PUT /articulo-unidads/precio-by-articulo - Actualizar precio de todas las unidades de un articulo
    public updatePrecioByArticulo$(data: any): Observable<any> {
        return this.httpClient.put<any>(`${this.endPoint}/precio-by-articulo`, data);
    }
}
