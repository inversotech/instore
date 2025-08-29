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
  selector: 'open-form-nuevo-descuento-modal',
  templateUrl: './form-nuevo-descuento-modal.component.html',
  styleUrls: ['./form-nuevo-descuento-modal.component.scss']
})
export class FormNuevoDescuentoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public formularioDescuento: FormGroup = this.formBuilder.group({
    almacen_id: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    tipo_descuento: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    fecha_inicio: ['', [Validators.required]],
    fecha_fin: ['', [Validators.required]],
    codigo_promocional: [''],
    tipo_aplicacion: ['', [Validators.required]],
    activo: [false, [Validators.required]],
    aplica_limite: [false, [Validators.required]],
    monto_minimo: ['', [Validators.required]],
    monto_maximo: ['', [Validators.required]],
    tiene_limite: [false, [Validators.required]],
    limite_uso: ['', [Validators.required]],
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

  constructor(private dialogRef: NbDialogRef<FormNuevoDescuentoModalComponent>,
    // private almacenUsuariosService: AlmacenUsuariosService,
    // private iipoOperacionsService: TipoOperacionsService,
    // private movimientosService: MovimientosService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
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
    // this.almacenUsuariosService.getMisAlmacenes$({})
    //   .pipe(map(res => res.data),
    //     takeUntil(this.destroy$))
    //   .subscribe(response => {
    //     this.misAlmacenes = response || [];
    //   }, err => {
    //     this.misAlmacenes = [];
    //   });
  }

  get f() {
    return this.formularioDescuento.controls;
  }

  public onClose() {
    setTimeout(() => {
      this.dialogRef.close({ cancel: true });
    }, 50);
  }

  public onSave() {
    const value = this.formularioDescuento.value;
    const invalid = this.formularioDescuento.invalid;
    
    console.log(value);
    


    // if (invalid) return;
    // const aFecha = this.datePipe.transform(value.fecha, 'yyyy-MM-dd');
    // if (confirm('¿Estás seguro de crear el item?')) {
    //   const data = {
    //     almacen_origen_id: value.almacen_origen_id,
    //     almacen_destino_id: value.almacen_destino_id,
    //     fecha: aFecha,
    //     detalle: value.detalle,
    //   };
      // this.loadingSpinnerSave = true;
      // this.movimientosService.addBetweenWarehouses$(data)
      //   .pipe(map(res => res.data),
      //     takeUntil(this.destroy$))
      //   .subscribe(response => {
      //     this.dialogRef.close({ cancel: false, data: response });
      //     this.loadingSpinnerSave = false;
      //   }, err => {
      //     this.loadingSpinnerSave = false;
      //   });
    // }

  }

}
