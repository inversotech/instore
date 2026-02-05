import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FormImportExcelModalComponent } from '../form-import-excel-modal/form-import-excel-modal.component';
import { ArticulosService } from 'src/app/providers/services/inventory/articulos.service';
import { FormArticuloImportExcelModalComponent } from '../form-articulo-import-excel-modal/form-articulo-import-excel-modal.component';

// https://www.colombiacompra.gov.co/clasificador-de-bienes-y-Servicios
@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public generalArticulos: any[] = [];
  public cabeceraArticulos: any[] = [];
  public segmentosArticulos: any[] = [];
  public familiasArticulos: any[] = [];
  public clasesArticulos: any[] = [];
  public productosArticulos: any[] = [];
  public itemsArticulos: any[] = [];

  public params: any = {
    a_id_grupo: null,
    a_id_segmento: null,
    a_id_familia: null,
    a_id_clase: null,
    a_id_producto: null,
    a_id_item: null,
    id_clase: null,
    text_search: null,
  };

  public loadingSpinner: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  public textSearch: FormControl = new FormControl();
  public textSearchSegmentos: FormControl = new FormControl();
  public textSearchFamilias: FormControl = new FormControl();
  public textSearchClases: FormControl = new FormControl();
  public textSearchProductos: FormControl = new FormControl();
  public textSearchItems: FormControl = new FormControl();

  // public grupoId: any;
  // get today() {
  //   return getDateToday();
  // }

  // public pagination: any = {
  //   currentPage: 1,
  //   pageSize: 15,
  //   totalItems: 15,
  // };

  // public paginationControls: any = {
  //   maxSize: 9,
  //   directionLinks: true,
  //   responsive: true,
  //   autoHide: true,
  // };
  public searchForm: FormGroup = this.formBuilder.group({ text_search: [] });

  constructor(
    private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    // private rolsService: RolsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private articulosService: ArticulosService,
  ) { }

  ngOnInit() {


    // Seleccionar si hay params en la ruta
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        this.loadDataParams(response);
      });

    this.getCabeceraArticulos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDataParams(response: any) {
    if (response.text_search) {
      setTimeout(() => {
        this.textSearch.patchValue(response.text_search);
      }, 700);
    }
    this.params.a_id_grupo = response.a_id_grupo ? parseInt(response.a_id_grupo, 10) : null;
    this.params.a_id_segmento = response.a_id_segmento ? parseInt(response.a_id_segmento, 10) : null;
    this.params.a_id_familia = response.a_id_familia ? parseInt(response.a_id_familia, 10) : null;
    this.params.a_id_clase = response.a_id_clase ? parseInt(response.a_id_clase, 10) : null;
    this.params.a_id_producto = response.a_id_producto ? parseInt(response.a_id_producto, 10) : null;
    this.params.id_clase = response.id_clase ? parseInt(response.id_clase, 10) : null;
    this.params.text_search = response.text_search ? response.text_search : null;
    console.log('this.params');
    console.log(this.params);

    this.getEstructuraArticulo(this.params);
  }

  public submitFormSearch() {
    this.getGeneralArticulos();
  }

  public getGeneralArticulos() {
    const textSearch = this.textSearch.value || '';
    const params = {
      text_search: textSearch,
      // page: this.pagination.currentPage,
      // per_page: this.pagination.pageSize,
      // text_search: 'meterial'
      // id_clase: 1,
    };
    this.loadingSpinner = true;
    this.articulosService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.generalArticulos = response;
        this.loadingSpinner = false;
      }, err => {
        this.generalArticulos = [];
        this.loadingSpinner = false;
      });
  }

  public getCabeceraArticulos() {
    // const textSearch = this.textSearch.value || '';
    const params = { id_clase: 1 };
    this.loadingSpinner = true;
    this.articulosService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.cabeceraArticulos = response;
        this.loadingSpinner = false;
      }, err => {
        this.cabeceraArticulos = [];
        this.loadingSpinner = false;
      });
  }

  public getChilds(parentId: any, claseId: any, text_search: any) {
    const params = {
      text_search: text_search,
      id_parent: parentId,
    };
    this.loadingSpinner = true;
    this.clearListas(claseId);
    this.articulosService.getByQuery$(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        this.loadListas(response, claseId);
      }, err => {
        this.loadingSpinner = false;
        this.clearListas(claseId);
      });
  }

  public clearListas(claseId: any) {
    switch (claseId) {
      case 1:
        this.segmentosArticulos = [];
        this.familiasArticulos = [];
        this.clasesArticulos = [];
        this.productosArticulos = [];
        this.itemsArticulos = [];
        break;
      case 2:
        this.familiasArticulos = [];
        this.clasesArticulos = [];
        this.productosArticulos = [];
        this.itemsArticulos = [];
        break;
      case 3:
        this.clasesArticulos = [];
        this.productosArticulos = [];
        this.itemsArticulos = [];
        break;
      case 4:
        this.productosArticulos = [];
        this.itemsArticulos = [];
        break;
      case 5:
        this.itemsArticulos = [];
        break;
      default:
        break;
    }
  }

  public loadListas(response: any[], claseId: any) {
    switch (claseId) {
      case 1:
        this.segmentosArticulos = response;
        break;
      case 2:
        this.familiasArticulos = response;
        break;
      case 3:
        this.clasesArticulos = response;
        break;
      case 4:
        this.productosArticulos = response;
        break;
      case 5:
        this.itemsArticulos = response;
        break;
      default:
        break;
    }
  }

  public getSegmentosForm() {
    const textSearch = this.textSearchSegmentos.value || '';
    this.getChilds(this.params.a_id_grupo, 1, textSearch);
  }
  public getSegmentos(item: any) {
    this.params.a_id_grupo = item.id_articulo;
    this.params.id_clase = item.id_clase;
    this.getChilds(this.params.a_id_grupo, 1, '');
  }

  public getFamiliasForm() {
    const textSearch = this.textSearchFamilias.value || '';
    this.getChilds(this.params.a_id_segmento, 2, textSearch);
  }
  public getFamilias(item: any) {
    this.params.a_id_segmento = item.id_articulo;
    this.params.id_clase = item.id_clase;
    this.getChilds(this.params.a_id_segmento, 2, '');
  }

  public getClasesForm() {
    const textSearch = this.textSearchClases.value || '';
    this.getChilds(this.params.a_id_familia, 3, textSearch);
  }
  public getClases(item: any) {
    this.params.a_id_familia = item.id_articulo;
    this.params.id_clase = item.id_clase;
    this.getChilds(this.params.a_id_familia, 3, '');
  }

  public getProductosForm() {
    const textSearch = this.textSearchProductos.value || '';
    this.getChilds(this.params.a_id_clase, 4, textSearch);
  }
  public getProductos(item: any) {
    this.params.a_id_clase = item.id_articulo;
    this.params.id_clase = item.id_clase;
    this.getChilds(this.params.a_id_clase, 4, '');
  }

  public getItemsForm() {
    const textSearch = this.textSearchItems.value || '';
    this.getChilds(this.params.a_id_producto, 5, textSearch);
  }
  public getItems(item: any) {
    this.params.a_id_producto = item.id_articulo;
    this.params.id_clase = item.id_clase;
    this.getChilds(this.params.a_id_producto, 5, '');
  }

  public getArticulo(item: any) {
    this.loadingSpinner = true;
    this.articulosService.getById$(item.id_articulo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.getEstructuraArticulo(response);
        this.loadParams(response);
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  private loadParams(articulo: any) {
    const textSearch = this.textSearch.value || '';
    this.params.a_id_grupo = articulo.a_id_grupo;
    this.params.a_id_segmento = articulo.a_id_segmento;
    this.params.a_id_familia = articulo.a_id_familia;
    this.params.a_id_clase = articulo.a_id_clase;
    this.params.a_id_producto = articulo.a_id_producto;
    this.params.id_clase = articulo.id_clase;
    this.params.text_search = textSearch;
    console.log(this.params);

    this.setParams();
  }
  private setParams() {
    this.router.navigate(['./'], { relativeTo: this.activatedRoute, queryParams: this.params });
  }

  private getEstructuraArticulo(articulo: any) {
    this.segmentosArticulos = [];
    this.familiasArticulos = [];
    this.clasesArticulos = [];
    this.productosArticulos = [];
    this.itemsArticulos = [];
    const atextSearch = '';
    if (articulo.id_clase === 1) { // GRUPO = 0
    } else if (articulo.id_clase === 2) { // SEGMENTO = 00
      this.getChilds(articulo.a_id_grupo, 1, atextSearch);
    } else if (articulo.id_clase === 3) { // FAMILIA = 0000
      this.getChilds(articulo.a_id_grupo, 1, atextSearch);
      this.getChilds(articulo.a_id_segmento, 2, atextSearch);
    } else if (articulo.id_clase === 4) { // CLASE = 000000
      this.getChilds(articulo.a_id_grupo, 1, atextSearch);
      this.getChilds(articulo.a_id_segmento, 2, atextSearch);
      this.getChilds(articulo.a_id_familia, 3, atextSearch);
    } else if (articulo.id_clase === 5) { // PRODUCTO = 00000000
      this.getChilds(articulo.a_id_grupo, 1, atextSearch);
      this.getChilds(articulo.a_id_segmento, 2, atextSearch);
      this.getChilds(articulo.a_id_familia, 3, atextSearch);
      this.getChilds(articulo.a_id_clase, 4, atextSearch);
    } else if (articulo.id_clase === 6) { // ITEM = 00000000 + 00000000
      this.getChilds(articulo.a_id_grupo, 1, atextSearch);
      this.getChilds(articulo.a_id_segmento, 2, atextSearch);
      this.getChilds(articulo.a_id_familia, 3, atextSearch);
      this.getChilds(articulo.a_id_clase, 4, atextSearch);
      this.getChilds(articulo.a_id_producto, 5, atextSearch);
    }
  }

  public onImportar() {
    const modal = this.nbDialogService.open(FormImportExcelModalComponent);
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          this.router.navigate(['./', res.id_persona], { relativeTo: this.activatedRoute });
        }
      }, err => { });
  }

  public onAddItem() {
    // this.params.a_id_item = item.id_articulo;
    this.params.id_clase = 6;
    const productoId = this.params.a_id_producto;
    this.router.navigate(['./', productoId], { relativeTo: this.activatedRoute, queryParams: this.params });
  }

  public onImportItem() {
    const modal = this.nbDialogService.open(FormArticuloImportExcelModalComponent);
    modal.componentRef.instance.id_clase = 6;
    modal.componentRef.instance.id_producto = this.params.a_id_producto;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel) {
          // this.router.navigate(['./', res.id_persona], { relativeTo: this.activatedRoute });
        }
      }, err => { });

    // this.params.id_clase = 6;
    // const productoId = this.params.a_id_producto;
    // this.router.navigate(['./', productoId], { relativeTo: this.activatedRoute, queryParams: this.params });
  }

  public onUpdateArticulo(item: any) {
    // this.params.a_id_item = item.id_articulo;
    this.params.id_clase = item.id_clase;
    this.router.navigate(['./', item.id_parent, item.id_articulo], { relativeTo: this.activatedRoute, queryParams: this.params });
  }

}
