import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'open-form-salida-nuevo-movimiento-modal',
  templateUrl: './form-salida-nuevo-movimiento-modal.component.html',
  styleUrls: ['./form-salida-nuevo-movimiento-modal.component.scss']
})
export class FormSalidaNuevoMovimientoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.formBuilder.group({
    id_almacen: ['', [Validators.required]],
    tipo_movimiento: ['S', [Validators.required]],
    id_tipo_operacion: ['', [Validators.required]],
    fecha: [new Date(), [Validators.required]],
    detalle: ['', [Validators.required]],
    tipo_gestion: ['AGREGADO', [Validators.required]],
  });
  public loadingSpinnerSave: boolean = false;
  // public tipoMovimientos: any[] = [{
  //   codigo: 'I', label: 'Ingreso',
  // }, {
  //   codigo: 'S', label: 'Salida'
  // }];
  public tipoOperacions: any[] = [];
  public misAlmacenes: any[] = [];

  public tipoGestions: any[] = [
    { id: 'AGREGADO', descripcion: 'Sin unidades individuales' },
    { id: 'UNIDAD', descripcion: 'Con tracking individual' },
  ];

  constructor(private dialogRef: NbDialogRef<FormSalidaNuevoMovimientoModalComponent>,
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

  seleccionado: any = 'AGREGADO';
  seleccionar(item: any) {
    this.seleccionado = item.id;
    this.newForm.get('tipo_gestion')?.setValue(item.id);
  }

  private getMasters() {
    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.misAlmacenes = response || [];
      }, err => {
        this.misAlmacenes = [];
      });
  }

  private getTipoOperacions() {
    const tipo_movimiento = this.newForm.get('tipo_movimiento')?.value;
    this.iipoOperacionsService.getByQuery$({ tipo_movimiento })
      .pipe(map(res => res.data),
        takeUntil(this.destroy$))
      .subscribe(response => {
        this.tipoOperacions = response || [];
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
    const aFecha = this.datePipe.transform(value.fecha, 'yyyy-MM-dd HH:mm:ss');
    if (confirm('¿Estás seguro de crear el item?')) {
      // this.nbDialogService.open(ConfirmModalComponent, { context: { mensaje: '¿Estás seguro de crear el item?' } })
      //   .onClose.subscribe(status => {
      //     if (status) {
      const data = {
        tipo_movimiento: value.tipo_movimiento,
        id_almacen: value.id_almacen,
        id_tipo_operacion: value.id_tipo_operacion,
        fecha: aFecha,
        detalle: value.detalle,
        tipo_gestion: value.tipo_gestion,
      };
      // console.log('data');
      // console.log(data);
      this.loadingSpinnerSave = true;
      this.movimientosService.addSalida$(data)
        .pipe(map(res => res.data),
          takeUntil(this.destroy$))
        .subscribe(response => {
          this.dialogRef.close({ cancel: false, data: response });
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
