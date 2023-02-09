import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { MonedasService } from 'src/app/providers/services/accounting/monedas.service';
import { AnhosService } from 'src/app/providers/services/accounting/anhos.service';
import { ArticulosService } from 'src/app/providers/services/inventory/articulos.service';
import { TipoIgvsService } from 'src/app/providers/services/accounting/tipo-igvs.service';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';

@Component({
  selector: 'open-form-update-inv-articulo-modal',
  templateUrl: './form-update-inv-articulo-modal.component.html',
  styleUrls: ['./form-update-inv-articulo-modal.component.scss']
})
export class FormUpdateInvArticuloModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  public monedas: any[] = [];
  public anhos: any[] = [];
  public tipoIgvs: any[] = [];

  private aItem: any;
  @Input() set item(iitem: any) {
    this.aItem = iitem;
    if (iitem) {
      this.loadingSpinnerSave = true;
      setTimeout(() => {
        this.textSearchArticulo.patchValue(`${this.aItem.i_articulo_nombre} (${this.aItem.i_articulo_codigo})`);
        this.newForm?.patchValue({
          anho_id: this.aItem.anho_id,
          almacen_id: this.aItem.almacen_id,
          articulo_id: this.aItem.articulo_id,
          moneda_id: this.aItem.moneda_id,
          tipo_igv_id: this.aItem.tipo_igv_id,
          codigo_almacen: this.aItem.codigo_almacen,
          stock_minimo: this.aItem.stock_minimo,
          es_servicio: this.aItem.es_servicio,
          activo: this.aItem.activo,

          stock_actual: this.aItem.stock_actual,
          costo: this.aItem.costo,
          costo_total: this.aItem.costo_total,
        });
        this.loadingSpinnerSave = false;
      }, 1000);
    }
  };

  public textSearchArticulo: FormControl = new FormControl({ value: '', disabled: true });
  @ViewChild('idArticuloSearch') idArticuloSearch!: ElementRef;
  public filteredArticuloList$: Observable<any[]> | undefined;

  constructor(private dialogRef: NbDialogRef<FormUpdateInvArticuloModalComponent>,
    private almacenArticulosService: AlmacenArticulosService,
    private monedasService: MonedasService,
    private articulosService: ArticulosService,
    private anhosService: AnhosService,
    private tipoIgvsService: TipoIgvsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.getMasters();
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {

    this.monedasService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.monedas = response;
      }, err => {
        this.monedas = [];
      });

    this.anhosService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.anhos = response;
      }, err => {
        this.anhos = [];
      });

    this.tipoIgvsService.getAll$()
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoIgvs = response;
      }, err => {
        this.tipoIgvs = [];
      });

  }

  private suscribeForm() {
    this.filteredArticuloList$ = this.textSearchArticulo.valueChanges
      .pipe(startWith(''),
        debounceTime(400),
        switchMap(this.loadArticles.bind(this)),
        map((articles) => {
          this.idArticuloSearch.nativeElement.click();
          return articles;
        })
      );
  }

  private loadArticles(term: string): Observable<any> {
    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = { text_search: term };
    return this.articulosService.getItems$(params)
      .pipe(map(x => x?.data || []));
  }

  public viewHandleArticle(value: any) {
    if (typeof value === 'object') {
      return value.nombre ? `${value.nombre} (${value.codigo})` : 'None.';
    } else {
      return value;
    }
  }

  public selectedChangeArticle(item: any) {
    if (!item || !item.articulo_id) return;
    this.newForm.get('articulo_id')?.setValue(item.articulo_id);
  }

  private buildForm() {
    const controls = {
      anho_id: [{ value: '', disabled: true }, [Validators.required]],
      almacen_id: [{ value: '', disabled: true }, [Validators.required]],
      articulo_id: [{ value: '', disabled: true }, [Validators.required]],
      moneda_id: ['', [Validators.required]],
      tipo_igv_id: ['', [Validators.required]],
      codigo_almacen: ['', [Validators.required]],
      stock_minimo: ['', [Validators.required]],
      es_servicio: [false, [Validators.required]],
      activo: [true, [Validators.required]],

      stock_actual: [{ value: 0, disabled: true }, [Validators.required]],
      costo: [{ value: 0, disabled: true }, [Validators.required]],
      costo_total: [{ value: 0, disabled: true }, [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.newForm.value;
    const invalid = this.newForm.invalid;
    if (invalid) return;

    if (confirm('¿Estás seguro de actualizar el item?')) {
      // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      //   .onClose.subscribe(status => {
      //     if (status) {
      const data = {
        moneda_id: value.moneda_id,
        tipo_igv_id: value.tipo_igv_id,
        codigo_almacen: value.codigo_almacen,
        stock_minimo: value.stock_minimo,
        es_servicio: value.es_servicio,
        activo: value.activo,
      };
      this.loadingSpinnerSave = true;
      this.almacenArticulosService.updateCustom$(this.aItem.anho_id, this.aItem.almacen_id, this.aItem.articulo_id, data)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.dialogRef.close({ cancel: false });
          this.loadingSpinnerSave = false;
        }, err => {
          this.loadingSpinnerSave = false;
        });
    }

    // } else {
    // }
    // }, err => {
    // });

  }

}
