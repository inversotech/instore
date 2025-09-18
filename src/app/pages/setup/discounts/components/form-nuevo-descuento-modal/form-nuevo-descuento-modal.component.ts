import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap, takeUntil, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { AlmacenUsuariosService } from 'src/app/providers/services/inventory/almacen-usuarios.service ';
import { TipoOperacionsService } from 'src/app/providers/services/inventory/tipo-operacions.service';
import { MovimientosService } from 'src/app/providers/services/inventory/movimientos.service';
import { DatePipe } from '@angular/common';
import { DiscountsCoreService } from 'src/app/providers/services/sales/discounts.core.service';

// interface TipoAplicacion {
//   id_desc_tipo_aplicacion: string;
//   nombre: string;
// }
@Component({
  selector: 'open-form-nuevo-descuento-modal',
  templateUrl: './form-nuevo-descuento-modal.component.html',
  styleUrls: ['./form-nuevo-descuento-modal.component.scss']

})

export class FormNuevoDescuentoModalComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public tiposDescuento: any[] = [];
  public tiposAplicacion: any[] = [];
  public formularioDescuento: FormGroup = this.formBuilder.group({
    id_almacen: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    // type_discounts: ['', [Validators.required]],
    tipo_descuento: ['', [Validators.required]],
    valor: ['', [Validators.required]],
    fecha_inicio: ['', [Validators.required]],
    fecha_vencimiento: ['', []],
    codigo_promocional: [''],
    id_desc_tipo_aplicacion: ['', [Validators.required]],
    activo: [false, [Validators.required]],
    aplica_limite_descuento: [false, [Validators.required]],
    monto_minimo: ['', []],
    monto_maximo: ['', []],
    tiene_limite: [false, [Validators.required]],
    limite_uso: ['', []],
  });


  public loadingSpinnerSave: boolean = false;
  public misAlmacenes: any[] = [];
  // public tiposAplicacion = [
  //   { id: 1, nombre: 'General' },
  //   { id: 2, nombre: 'Sectorizado' },
  //   { id: 3, nombre: 'Personalizado' }
  // ];
  // public tipoDescuento = [
  //   { id: 1, nombre: 'General' },
  //   { id: 2, nombre: 'Sectorizado' },
  //   { id: 3, nombre: 'Personalizado' }
  // ];


  constructor(private dialogRef: NbDialogRef<FormNuevoDescuentoModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    // private iipoOperacionsService: TipoOperacionsService,
    // private movimientosService: MovimientosService,
    private toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private discountsCoreService: DiscountsCoreService,
    
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
    this.discountsCoreService.getTipoAplicacion({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Tipos de aplicación recibidos:', res);
          this.tiposAplicacion = res || [];
        },
        error: (err) => {
          console.error('Error al obtener tipos de aplicación:', err);
        }
      });
    this.discountsCoreService.getTipoDiscount({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('Tipos de descuento recibidos:', res);
          this.tiposDescuento = res || [];
        },
        error: (err) => {
          console.error('Error al obtener tipos de descuento:', err);
        }
      });

    this.almacenUsuariosService.getMisAlmacenes$({})
      .pipe(takeUntil(this.destroy$))
      .pipe(
        takeUntil(this.destroy$),
        // catchError(err => {
        //   console.error('Error capturado:', err);
        //   return of([]);
        // })
      )
      // .pipe(map(res => res.data), takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Almacenes recibidos:', response);
          this.misAlmacenes = response || [];
        },
        error: (err) => {
          console.error('Error al obtener almacenes:', err);
          this.misAlmacenes = [];
        }
      });

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

    const invalid = this.formularioDescuento.invalid;
    if (invalid) {
      this.toastrService.warning('Completa todos los campos obligatorios', 'Formulario incompleto');
      return;
    }

    const rawValue = this.formularioDescuento.value;
    const value = {
      ...rawValue,
      fecha_inicio: this.datePipe.transform(rawValue.fecha_inicio, 'yyyy-MM-dd HH:mm:ss'),
      fecha_vencimiento: this.datePipe.transform(rawValue.fecha_vencimiento, 'yyyy-MM-dd HH:mm:ss'),
       activo: rawValue.activo ? 1 : 0,
    aplica_limite_descuento: rawValue.aplica_limite_descuento ? 1 : 0,
    tiene_limite: rawValue.tiene_limite ? 1 : 0,
    // Conversión de valores numéricos
    valor: Number(rawValue.valor),
    importe_minimo_venta: Number(rawValue.monto_minimo),
    importe_maximo_venta: Number(rawValue.monto_maximo),
    limite_uso: Number(rawValue.limite_uso),
    id_almacen: Number(rawValue.id_almacen),

    };
       this.loadingSpinnerSave = true;
    this.discountsCoreService.crear(value).subscribe({
      next: (respuesta) => {
        console.log('Descuento creado:', respuesta);
        this.toastrService.success('Descuento creado exitosamente', 'Éxito');
        this.dialogRef.close({ cancel: false, data: respuesta }); // Cierra el modal y pasa los datos
        this.loadingSpinnerSave = false;
      },
      error: (error) => {
        console.error('Error al crear descuento:', error);
        this.toastrService.danger('No se pudo crear el descuento', 'Error');
        this.loadingSpinnerSave = false;
      }
    });


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
