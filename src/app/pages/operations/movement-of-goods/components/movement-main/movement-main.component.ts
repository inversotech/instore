import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { debounceTime, finalize, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlmacenesService } from 'src/app/providers/services/inventory/almacenes.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticulosService } from 'src/app/providers/services/inventory/articulos.service';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { MovimientoDetallesService } from 'src/app/providers/services/inventory/movimiento-detalles.service';

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
    movimiento_detalle_id: [''],
    articulo_id: [1, Validators.required],
    cantidad: [1, Validators.required],
    // detalle: ['', Validators.required],
    // text_search: ['', Validators.required],
    costo_uni: ['', Validators.required],
  });
  public movimientoDetalles: any[] = [];
  public movimimentoDetallesTotal: any = 0;
  // @ViewChild('attrDetallecantidad') attrDetallecantidad!: ElementRef;

  public textSearchArticulo: FormControl = new FormControl('');
  @ViewChild('idArticuloSearch') idArticuloSearch!: ElementRef;
  public filteredArticuloList$: Observable<any[]> | undefined;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
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
        map(res => res.get('movimiento_id')),
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

  private loadArticulos(term: string): Observable<any> {
    if (!this.movimientoData || !this.movimientoData.almacen_id) return of([]);
    if (!this.movimientoData || !this.movimientoData.anho_id) return of([]);

    if (typeof term === 'object' || term === '' || term === null) return of([]);
    const params = {
      almacen_id: this.movimientoData.almacen_id,
      anho_id: this.movimientoData.anho_id,
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
    this.addForm.get('articulo_id')?.setValue(item.i_articulo_id);
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
    this.movimientoDetallesService.getByQuery$({ movimiento_id: this.movimientoId })
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
      movimiento_detalle_id: value.movimiento_detalle_id,
      movimiento_id: this.movimientoId,
      articulo_id: value.articulo_id,
      cantidad: value.cantidad,
      costo_uni: value.costo_uni,
      // importe: parseFloat(value.precio) * parseFloat(value.cantidad),
    };
    if (value.movimiento_detalle_id) {
      this.loadingSave = true;
      this.movimientoDetallesService.update$(value.movimiento_detalle_id, data)
        .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
        .subscribe(response => {
          this.getMovimientoDetalle();
          this.cleanFormDetalle();
        });
    } else {
      this.loadingSave = true;
      this.movimientoDetallesService.add$(data)
        .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
        .subscribe(response => {
          this.getMovimientoDetalle();
          this.cleanFormDetalle();
        });
    }
  }

  public cleanFormDetalle() {
    this.addForm.patchValue({ movimiento_detalle_id: '', articulo_id: '', cantidad: 1, costo_uni: '' });
    this.idArticuloSearch.nativeElement.focus();
    this.textSearchArticulo.patchValue('');
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

  public onEditDetalle(item: any) { }

  public onDeleteDetalle(item: any) {
    if(!confirm('¿Seguro?')) return;

    this.loadingSave = true;
    this.movimientoDetallesService.delete$(item.movimiento_detalle_id)
      .pipe(map(res => res.data), finalize(() => this.loadingSave = false))
      .subscribe(response => {
        this.getMovimientoDetalle();
        this.cleanFormDetalle();
      });
  }

  public onDeleteAllDetalle() {
    if (!this.movimientoData) return;
    if (!this.movimientoData.movimiento_id) return;
    if(!confirm('¿Seguro?')) return;

    this.loadingSave = true;
    this.movimientoDetallesService.deleteAll$(this.movimientoData.movimiento_id)
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
    this.router.navigate(['../'], { relativeTo: this.activatedRoute, queryParams: this.params });
  }


}
