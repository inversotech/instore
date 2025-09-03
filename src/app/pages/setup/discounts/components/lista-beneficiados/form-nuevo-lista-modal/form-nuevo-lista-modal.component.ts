import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';
import { FormNuevoAgregarModalComponent } from './form-nuevo-agregar-modal/form-nuevo-agregar-modal.component';
@Component({
  selector: 'open-form-nuevo-lista-modal',
  templateUrl: './form-nuevo-lista-modal.component.html',
  styleUrls: ['./form-nuevo-lista-modal.component.scss']
})
export class FormNuevoListaModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public formularioListaModal: FormGroup = this.formBuilder.group({

  });


  public loadingSpinnerSave: boolean = false;
  public misAlmacenes: any[] = [];
  public tiposAplicacion = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Sectorizado' },
    { id: 3, nombre: 'Personalizado' }
  ];
  public tipoDescuento = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Sectorizado' },
    { id: 3, nombre: 'Personalizado' }
  ];

  constructor(private dialogRef: NbDialogRef<FormNuevoListaModalComponent>,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialogService: NbDialogService,
  ) { }



  // activo: boolean = true;
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
    return this.formularioListaModal.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.formularioListaModal.value;
    const invalid = this.formularioListaModal.invalid;

    console.log(value);
  }
  abrirModal3() {
    this.dialogService.open(FormNuevoAgregarModalComponent);
  }
}
