import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
// import { VouchersService } from 'src/app/providers/services/accounting/vouchers.service';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { MesesService } from 'src/app/providers/services/accounting/meses.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { KardexesService } from 'src/app/providers/services/inventory/kardexes.service';

@Component({
  selector: 'open-lista-general',
  templateUrl: './lista-general.component.html',
  styleUrls: ['./lista-general.component.scss']
})
export class ListaGeneralComponent implements OnInit, OnDestroy {
  public anhos: any[] = [];
  public meses: any[] = [];
  public almacenes: any[] = [];
  // public vouchers: any[] = [];
  public kardexes: any[] = [];
  // public movimientos: any[] = [];
  public loadingSpinner: boolean = false;
  // public textSearch: FormControl = new FormControl();
  public filterForm: FormGroup = this.formBuilder.group({
    modo: [1, Validators.required],
    id_anho: ['', Validators.required],
    id_mes: ['', Validators.required],
    id_almacen: ['', Validators.required],
    // id_articulo: ['', Validators.required],
    id_articulo: [''],
    // id_articulo: ['-1'],
    // text_search: [''],
  });
  private destroy$: Subject<void> = new Subject<void>();

  public pagination: any = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  };

  public paginationControls: any = {
    maxSize: 9,
    directionLinks: true,
    responsive: true,
    autoHide: true,
  };

  public textSearchArticulo: FormControl = new FormControl('');
  @ViewChild('idArticuloSearch') idArticuloSearch!: ElementRef;
  public filteredArticuloList$: Observable<any[]> | undefined;

  constructor(private formBuilder: FormBuilder,
    private kardexesService: KardexesService,
    private anhosService: AnhosService,
    private mesesService: MesesService,
    private almacenUsuariosService: AlmacenUsuariosService,
    private activatedRoute: ActivatedRoute,
    private almacenArticulosService: AlmacenArticulosService,
    private nbToastrService: NbToastrService,
  ) { }

  ngOnInit() {
    // Seleccionar si hay params en la ruta
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        // if (response.id_voucher) {
        //   setTimeout(() => {
        //     this.filterForm.get('id_voucher')?.patchValue(parseInt(response.id_voucher));
        //   }, 1000);
        // }
        // if (response.text_search) {
        // setTimeout(() => {
        // this.filterForm.get('text_search')?.patchValue(response.text_search);
        // }, 700);
        // }
      });
    this.getMasters();
    this.suscribeForm();
    this.initPagination();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public pageChanged(event: any) {
    this.pagination.currentPage = event;
    this.getInventarioKardexes();
  }

  private initPagination() {
    this.pagination.currentPage = 1;
    this.pagination.pageSize = 15;
    this.pagination.totalItems = 0;
  }

  private suscribeForm() {
    this.filterForm.get('modo')?.valueChanges
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        if (response == 0) {
          setTimeout(() => {
            this.filterForm.get('id_articulo')?.disable();
          }, 0);
        } else {
          setTimeout(() => {
            this.filterForm.get('id_articulo')?.enable();
          }, 0);
        }
      });

    this.filteredArticuloList$ = this.textSearchArticulo.valueChanges
      .pipe(startWith(''),
        debounceTime(400),
        switchMap(this.loadArticulos.bind(this)),
        map((items) => {
          this.idArticuloSearch.nativeElement.click();
          return items;
        })
      );
  }


  private loadArticulos(term: string): Observable<any> {
    if (!this.filterForm.get('id_almacen')?.value) return of([]);
    if (!this.filterForm.get('id_anho')?.value) return of([]);

    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = {
      id_almacen: this.filterForm.get('id_almacen')?.value,
      id_anho: this.filterForm.get('id_anho')?.value,
      text_search: term,
    };
    return this.kardexesService.getArticulosToSearchKardexByQuery$(params)
      .pipe(map(x => x?.data || []));
  }

  public viewHandleArticulo(value: any) {
    if (typeof value === 'object') {
      return value.i_id_articulo ? `${value.i_articulo_nombre} (${value.i_articulo_codigo})` : 'None.';
    } else {
      return value;
    }
  }

  public selectedChangeArticulo(item: any) {
    if (!item || !item.i_id_articulo) return;
    this.filterForm.get('id_articulo')?.setValue(item.i_id_articulo);
    // this.filterForm.get('costo_uni')?.setValue(item.costo);
  }

  public submitFormSearch() {
    this.getInventarioKardexes();
  }

  public getMasters() {
    this.anhosService.getAll$()
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        const anhos: any[] = response || [];
        this.anhos = anhos;
        const selected = anhos.find(res => res.is_selected);
        if (selected) {
          setTimeout(() => {
            this.filterForm.get('id_anho')?.patchValue(selected.id_anho);
          }, 0);
        }
      }, err => {
        this.loadingSpinner = false;
        this.anhos = [];
      });

    this.mesesService.getAll$()
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        const meses: any[] = response || [];
        this.meses = meses;
        const selected = meses.find(res => res.is_selected);
        if (selected) {
          setTimeout(() => {
            this.filterForm.get('id_mes')?.patchValue(selected.id_mes);
          }, 0);
        }

      }, err => {
        this.loadingSpinner = false;
        this.meses = [];
      });

    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        this.almacenes = response || [];
        if (this.almacenes.length > 0) {
          setTimeout(() => {
            this.filterForm.get('id_almacen')?.patchValue(this.almacenes[0].id_almacen);
          }, 0);
        }
      }, err => {
        this.loadingSpinner = false;
        this.meses = [];
      });
  }

  public onViewPdf() {
    if (this.filterForm.invalid) return;
    const params = {
      id_anho: this.filterForm.value.id_anho,
      id_mes: this.filterForm.value.id_mes,
      id_almacen: this.filterForm.value.id_almacen,
      id_articulo: this.filterForm.value.id_articulo,
      modo: this.filterForm.value.modo,
    };
    this.loadingSpinner = true;
    this.kardexesService.viewPdf$(params)
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$),
      )
      .subscribe(data => {
        if (data) {
          // const modal = this.nbDialogService.open(VisorFileComponent);
          // modal.componentRef.instance.fileView = data;
          // modal.componentRef.instance.extension = 'pdf';
          // modal.onClose.subscribe(value => {
          //   if (value) {

          //   }
          // });
        }
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onDownloadExcel() {
    if (this.filterForm.invalid) return;
    const params = {
      id_anho: this.filterForm.value.id_anho,
      id_mes: this.filterForm.value.id_mes,
      id_almacen: this.filterForm.value.id_almacen,
      id_articulo: this.filterForm.value.id_articulo,
      modo: this.filterForm.value.modo,
    };
    this.loadingSpinner = true;
    this.kardexesService.downloadExcel$(params)
      .pipe(
        // map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        let blob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(blob);
        const file = document.createElement('a');
        file.download = params.id_anho + '-' + params.id_mes + '-' + params.id_almacen + ' - Reporte kardex.xlsx';
        file.href = url;
        file.click();
        this.loadingSpinner = false;
      }, err => {
        this.loadingSpinner = false;
      });
  }

  public onDownloadPdf() {
  }

  public getInventarioKardexes() {
    if (this.filterForm.invalid) return;

    const value = this.filterForm.get('modo')?.value;
    if (value == 0) { // Todos
      const params = {
        id_anho: this.filterForm.value.id_anho,
        id_mes: this.filterForm.value.id_mes,
        id_almacen: this.filterForm.value.id_almacen,
      };
      this.loadingSpinner = true;
      this.kardexesService.getFull$(params)
        .pipe(
          map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.loadingSpinner = false;
          this.kardexes = response || [];
        }, err => {
          this.kardexes = [];
          this.loadingSpinner = false;
        });

    } else {


      if (!this.filterForm.value.id_articulo) {
        this.kardexes = [];
        this.nbToastrService.warning('Debe seleccionar un artículo para ver el kardex.', 'Error');
        return;
      }

      const params = {
        id_anho: this.filterForm.value.id_anho,
        id_mes: this.filterForm.value.id_mes,
        id_almacen: this.filterForm.value.id_almacen,
        id_articulo: this.filterForm.value.id_articulo,
      };
      this.loadingSpinner = true;
      this.kardexesService.getByArticulo$(params)
        .pipe(
          map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.loadingSpinner = false;
          this.kardexes = response || [];
        }, err => {
          this.kardexes = [];
          this.loadingSpinner = false;
        });
    }
  }

}
