import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenArticulosService } from 'src/app/providers/services/inventory/almacen-articulos.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'open-form-bw-update-movimiento-modal',
  templateUrl: './form-bw-update-movimiento-modal.component.html',
  styleUrls: ['./form-bw-update-movimiento-modal.component.scss']
})
export class FormBwUpdateMovimientoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  // public tipoMovimientos: any[] = [{
  //   codigo: 'I', label: 'Ingreso',
  // }, {
  //   codigo: 'S', label: 'Salida'
  // }];

  public aInventarioMovimiento: any;
  @Input() public set inventarioMovimiento(item: any) {
    this.aInventarioMovimiento = item;
    if (this.aInventarioMovimiento) {
      this.patchForm();
    }
  };

  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  constructor(private dialogRef: NbDialogRef<FormBwUpdateMovimientoModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    private iipoOperacionsService: TipoOperacionsService,
    private movimientosService: MovimientosService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getMasters();
    this.getTipoOperacions();
    this.suscribeForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {
    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misAlmacenes = response || [];
        if (this.aInventarioMovimiento) {
          setTimeout(() => {
            this.newForm.get('id_almacen_origen')?.patchValue(this.aInventarioMovimiento.id_almacen);
            this.newForm.get('id_almacen_destino')?.patchValue(this.aInventarioMovimiento.id_almacen_destino);
          }, 0);
        }
      }, err => {
        this.misAlmacenes = [];
      });
  }

  private patchForm() {
    setTimeout(() => {
      this.newForm.patchValue({
        id_almacen_origen: this.aInventarioMovimiento.id_almacen,
        id_almacen_destino: this.aInventarioMovimiento.id_almacen_destino,
        tipo_movimiento: this.aInventarioMovimiento.tipo_movimiento,
        id_tipo_operacion: this.aInventarioMovimiento.id_tipo_operacion,
        fecha: new Date(this.aInventarioMovimiento.fecha),
        detalle: this.aInventarioMovimiento.detalle,
      });
    }, 0);
  }

  private getTipoOperacions() {
    const tipo_movimiento = this.newForm.get('tipo_movimiento')?.value;
    if(!tipo_movimiento) return;

    this.iipoOperacionsService.getByQuery$({ tipo_movimiento })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoOperacions = response || [];
        if (this.aInventarioMovimiento) {
          setTimeout(() => {
            this.newForm.get('id_tipo_operacion')?.patchValue(this.aInventarioMovimiento.id_tipo_operacion);
          }, 0);
        }
      }, err => {
        this.tipoOperacions = [];
      });

  }

  private suscribeForm() {
    this.newForm.get('tipo_movimiento')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        setTimeout(() => {
          this.getTipoOperacions();
        }, 0);
      }, err => {
      });
  }

  private buildForm() {
    const controls = {
      id_almacen_origen: [{ value: '', disabled: true }, [Validators.required]],
      id_almacen_destino: [{ value: '', disabled: true }, [Validators.required]],
      // id_almacen: [{ value: '', disabled: true }, [Validators.required]],
      // tipo_movimiento: [{ value: '', disabled: true }, [Validators.required]],
      // id_tipo_operacion: ['', [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      detalle: ['', [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  get f() {
    return this.newForm.controls;
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
    const aFecha = this.datePipe.transform(value.fecha, 'yyyy-MM-dd');
    if (!confirm('¿Estás seguro de actualizar el item?')) return;

    const data = {
       // tipo_movimiento: value.tipo_movimiento,
      //  id_almacen_origen: value.id_almacen_origen,
      //  id_almacen_destino: value.id_almacen_destino,
       // id_tipo_operacion: value.id_tipo_operacion,
      fecha: aFecha,
      detalle: value.detalle,
    };
    this.loadingSpinnerSave = true;
    this.movimientosService.updateBetweenWarehouses$(this.aInventarioMovimiento.id_movimiento, data)
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.dialogRef.close({ cancel: false, data: response });
        this.loadingSpinnerSave = false;
      }, err => {
        this.loadingSpinnerSave = false;
      });
  }

}
