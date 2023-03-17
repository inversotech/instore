import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
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
    anho_id: ['', Validators.required],
    mes_id: ['', Validators.required],
    almacen_id: ['', Validators.required],
    articulo_id: ['', Validators.required],
    // articulo_id: ['-1'],
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
  ) { }

  ngOnInit() {
    // Seleccionar si hay params en la ruta
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        // if (response.voucher_id) {
        //   setTimeout(() => {
        //     this.filterForm.get('voucher_id')?.patchValue(parseInt(response.voucher_id));
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
            this.filterForm.get('articulo_id')?.disable();
          }, 0);
        } else {
          setTimeout(() => {
            this.filterForm.get('articulo_id')?.enable();
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
    if (!this.filterForm.get('almacen_id')?.value) return of([]);
    if (!this.filterForm.get('anho_id')?.value) return of([]);

    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = {
      almacen_id: this.filterForm.get('almacen_id')?.value,
      anho_id: this.filterForm.get('anho_id')?.value,
      text_search: term,
    };
    return this.almacenArticulosService.getArticulosToSearchByQuery$(params)
      .pipe(map(x => x?.data || []));
  }

  public viewHandleArticulo(value: any) {
    if (typeof value === 'object') {
      return value.i_articulo_id ? `${value.i_articulo_nombre} (${value.i_articulo_codigo})` : 'None.';
    } else {
      return value;
    }
  }

  public selectedChangeArticulo(item: any) {
    if (!item || !item.i_articulo_id) return;
    this.filterForm.get('articulo_id')?.setValue(item.i_articulo_id);
    // this.filterForm.get('costo_uni')?.setValue(item.costo);
  }

  public submitFormSearch() {
    this.getInventarioKardexes();
  }

  public getMasters() {
    this.anhosService.getAll$()
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        const anhos: any[] = response || [];
        this.anhos = anhos;
        const selected = anhos.find(res => res.is_selected);
        if (selected) {
          setTimeout(() => {
            this.filterForm.get('anho_id')?.patchValue(selected.anho_id);
          }, 0);
        }
      }, err => {
        this.loadingSpinner = false;
        this.anhos = [];
      });

    this.mesesService.getAll$()
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        const meses: any[] = response || [];
        this.meses = meses;
        const selected = meses.find(res => res.is_selected);
        if (selected) {
          setTimeout(() => {
            this.filterForm.get('mes_id')?.patchValue(selected.mes_id);
          }, 0);
        }

      }, err => {
        this.loadingSpinner = false;
        this.meses = [];
      });

    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(
        map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.loadingSpinner = false;
        this.almacenes = response || [];
        if (this.almacenes.length > 0) {
          setTimeout(() => {
            this.filterForm.get('almacen_id')?.patchValue(this.almacenes[0].almacen_id);
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
      anho_id: this.filterForm.value.anho_id,
      mes_id: this.filterForm.value.mes_id,
      almacen_id: this.filterForm.value.almacen_id,
      articulo_id: this.filterForm.value.articulo_id,
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
      anho_id: this.filterForm.value.anho_id,
      mes_id: this.filterForm.value.mes_id,
      almacen_id: this.filterForm.value.almacen_id,
      articulo_id: this.filterForm.value.articulo_id,
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
        file.download = params.anho_id + '-' + params.mes_id + '-' + params.almacen_id + ' - Reporte kardex.xlsx';
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
        anho_id: this.filterForm.value.anho_id,
        mes_id: this.filterForm.value.mes_id,
        almacen_id: this.filterForm.value.almacen_id,
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

      const params = {
        anho_id: this.filterForm.value.anho_id,
        mes_id: this.filterForm.value.mes_id,
        almacen_id: this.filterForm.value.almacen_id,
        articulo_id: this.filterForm.value.articulo_id,
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
