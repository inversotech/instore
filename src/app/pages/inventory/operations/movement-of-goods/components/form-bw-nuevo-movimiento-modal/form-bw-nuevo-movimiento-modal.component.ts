import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'open-form-bw-nuevo-movimiento-modal',
  templateUrl: './form-bw-nuevo-movimiento-modal.component.html',
  styleUrls: ['./form-bw-nuevo-movimiento-modal.component.scss']
})
export class FormBwNuevoMovimientoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public newForm: FormGroup = this.buildForm();
  public loadingSpinnerSave: boolean = false;
  public misAlmacenes: any[] = [];

  constructor(private dialogRef: NbDialogRef<FormBwNuevoMovimientoModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    private iipoOperacionsService: TipoOperacionsService,
    private movimientosService: MovimientosService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.getMasters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {
    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        this.misAlmacenes = response || [];
      }, err => {
        this.misAlmacenes = [];
      });
  }

  private buildForm() {
    const controls = {
      id_almacen_origen: ['', [Validators.required]],
      id_almacen_destino: ['', [Validators.required]],
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
    if (confirm('¿Estás seguro de crear el item?')) {
      const data = {
        id_almacen_origen: value.id_almacen_origen,
        id_almacen_destino: value.id_almacen_destino,
        fecha: aFecha,
        detalle: value.detalle,
      };
      this.loadingSpinnerSave = true;
      this.movimientosService.addBetweenWarehouses$(data)
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

}
