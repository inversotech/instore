import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { debounceTime, finalize, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { MovimientoDetallesService } from 'src/app/providers/services/inventory/movimiento-detalles.service';
import { FormUpdateMovimientoModalComponent } from '../form-update-movimiento-modal/form-update-movimiento-modal.component';

@Component({
  selector: 'open-movement-main',
  templateUrl: './movement-main.component.html',
  styleUrls: ['./movement-main.component.scss']
})
export class MovementMainComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public params: any;

  private movimientoId: any;
  public movimientoData: any;
  public loadingSave: boolean = false;

  public addForm: FormGroup = this.formBuilder.group({
    id_movimiento_detalle: [''],
    id_articulo: [1, Validators.required],
    cantidad: [1, Validators.required],
    // detalle: ['', Validators.required],
    // text_search: ['', Validators.required],
    costo_uni: ['', Validators.required],
  });
  public movimientoDetalles: any[] = [];
  public movimimentoDetallesTotal: any = 0;
  @ViewChild('attrDetallecantidad') attrDetallecantidad!: ElementRef;

  public textSearchArticulo: FormControl = new FormControl('');
  @ViewChild('idArticuloSearch') idArticuloSearch!: ElementRef;
  public filteredArticuloList$: Observable<any[]> | undefined;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private nbDialogService: NbDialogService,
    private movimientosService: MovimientosService,
    private movimientoDetallesService: MovimientoDetallesService,
    private almacenArticulosService: AlmacenArticulosService,
  ) { }

  ngOnInit() {
    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        this.params = response;
      });

    this.activatedRoute?.paramMap
      .pipe(
        map(res => res.get('id_movimiento')),
        takeUntil(this.destroy$),
      ).subscribe(res => {
        this.movimientoId = res;
        this.getMovimiento();
        this.getMovimientoDetalle();
      });
    this.suscribeForm();
  }

  private suscribeForm() {
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


  public onUpdate() {
    if (!this.movimientoData) return;

    const modal = this.nbDialogService.open(FormUpdateMovimientoModalComponent);
    modal.componentRef.instance.inventarioMovimiento = this.movimientoData;
    modal.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res.cancel && res.data) {
          this.getMovimiento();
        }
      }, err => { });
  }

  private loadArticulos(term: string): Observable<any> {
    if (!this.movimientoData || !this.movimientoData.id_almacen) return of([]);
    if (!this.movimientoData || !this.movimientoData.id_anho) return of([]);

    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = {
      id_almacen: this.movimientoData.id_almacen,
      id_anho: this.movimientoData.id_anho,
      id_movimiento: this.movimientoId,
      text_search: term,
    };
    return this.almacenArticulosService.getArticulosToSalidaSearchByQuery$(params)
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
    this.addForm.get('id_articulo')?.setValue(item.i_id_articulo);
    this.addForm.get('costo_uni')?.setValue(item.costo);
  }

  private getMovimiento() {
    if (!this.movimientoId) return;
    this.loadingSave = true;
    this.movimientosService.getById$(this.movimientoId)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        setTimeout(() => {
          this.movimientoData = response;
        }, 0);
      });
  }

  private getMovimientoDetalle() {
    if (!this.movimientoId) return;
    this.loadingSave = true;
    this.movimientoDetallesService.getByQuery$({ id_movimiento: this.movimientoId })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        setTimeout(() => {
          this.movimientoDetalles = response;
        }, 0);
      });
  }

  public submitFormAdd() {
    const value = this.addForm.value;
    const invalid = this.addForm.invalid;
    if (invalid) return;

    const data: any = {
      id_movimiento_detalle: value.id_movimiento_detalle,
      id_movimiento: this.movimientoId,
      id_articulo: value.id_articulo,
      cantidad: value.cantidad,
      costo_uni: value.costo_uni,
      // importe: parseFloat(value.precio) * parseFloat(value.cantidad),
    };
    if (value.id_movimiento_detalle) {
      this.loadingSave = true;
      this.movimientoDetallesService.update$(value.id_movimiento_detalle, data)
        .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
        .subscribe(
          {
            next: (response: any) => {
              this.loadingSave = false;
              this.getMovimientoDetalle();
              this.cleanFormDetalle();
            },
            error: (err: any) => {
              this.loadingSave = false;
            }
          }
        );
    } else {
      this.loadingSave = true;
      this.movimientoDetallesService.add$(data)
        .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
        .subscribe(
          {
            next: (response: any) => {
              this.loadingSave = false;
              this.getMovimientoDetalle();
              this.cleanFormDetalle();
            },
            error: (err: any) => {
              this.loadingSave = false;
            }
          });
    }
  }

  public finalize() {
    if (!confirm('¿Seguro?')) return;
    this.loadingSave = true;
    this.movimientosService.finalize$(this.movimientoId, {})
      .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
      .subscribe({
        next: (response: any) => {
          this.loadingSave = false;
          this.getMovimientoDetalle();
          this.cleanFormDetalle();
        },
        error: (err: any) => {
          this.loadingSave = false;
        }
      });
  }

  public cleanFormDetalle() {
    this.addForm.patchValue({ id_movimiento_detalle: '', id_articulo: '', cantidad: 1, costo_uni: '' });
    this.textSearchArticulo.patchValue('');
    this.textSearchArticulo.enable();
    this.idArticuloSearch.nativeElement.focus();
  }

  get fe() {
    return this.addForm.controls;
  }
  get fd() {
    return this.addForm.controls;
  }

  public refreshDetalle() {
    this.getMovimientoDetalle();
  }

  public onEditDetalle(item: any) {
    this.addForm.patchValue({
      id_movimiento_detalle: item.id_movimiento_detalle,
      id_articulo: item.id_articulo,
      cantidad: item.cantidad,
      costo_uni: item.costo_uni
    });
    this.attrDetallecantidad.nativeElement.focus();
    this.textSearchArticulo.patchValue(`${item.i_articulo_nombre} (${item.i_articulo_codigo})`);
    this.textSearchArticulo.disable();
  }

  public onDeleteDetalle(item: any) {
    if (!confirm('¿Seguro?')) return;

    this.loadingSave = true;
    this.movimientoDetallesService.delete$(item.id_movimiento_detalle)
      .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        this.getMovimientoDetalle();
        this.cleanFormDetalle();
      });
  }

  public onDeleteAllDetalle() {
    if (!this.movimientoData) return;
    if (!this.movimientoData.id_movimiento) return;
    if (!confirm('¿Seguro?')) return;

    this.loadingSave = true;
    this.movimientoDetallesService.deleteAll$(this.movimientoData.id_movimiento)
      .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        this.getMovimientoDetalle();
        this.cleanFormDetalle();
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onBack() {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute, queryParams: this.params });
  }


}
