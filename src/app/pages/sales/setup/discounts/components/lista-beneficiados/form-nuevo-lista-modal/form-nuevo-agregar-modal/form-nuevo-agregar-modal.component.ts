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
  selector: 'inverso-form-nuevo-agregar-modal',
  templateUrl: './form-nuevo-agregar-modal.component.html',
  styleUrls: ['./form-nuevo-agregar-modal.component.scss']
})
export class FormNuevoAgregarModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public formularioAgregar: FormGroup = this.formBuilder.group({
    documento: ['', [Validators.required]],
    tipo_documento: ['', [Validators.required]],
    nombres: ['', [Validators.required]],
    apellido_paterno: ['', [Validators.required]],
    apellido_materno: ['', [Validators.required]],
  });

  public loadingSpinnerSave: boolean = false;
  public misAlmacenes: any[] = [];
  public tiposAplicacion = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Sectorizado' },
    { id: 3, nombre: 'Personalizado' }
  ];
  public tipoDocumento = [
    { id: 1, nombre: 'DNI' },
    { id: 2, nombre: 'Carnet de extranjería' },
  ];

  constructor(private dialogRef: NbDialogRef<FormNuevoAgregarModalComponent>,

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

  }

  get f() {
    return this.formularioAgregar.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.formularioAgregar.value;
    const invalid = this.formularioAgregar.invalid;

    console.log(value);

  }

}
