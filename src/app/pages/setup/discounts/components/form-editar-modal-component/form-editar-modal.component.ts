import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { NbDialogRef, NbDialogConfig, NbDialogService, NbToastrService, NB_DIALOG_CONFIG } from '@nebular/theme';
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
  selector: 'open-form-editar-modal-component',
  templateUrl: './form-editar-modal.component.html',
  styleUrls: ['./form-editar-modal.component.scss']

})

export class FormEditarModalComponent implements OnInit, OnDestroy {
  // @Input() descuento: any;

  private destroy$: Subject<void> = new Subject<void>();
  public tiposDescuento: any[] = [];
  public tiposAplicacion: any[] = [];
  public formularioDescuento!: FormGroup;



  public loadingSpinnerSave: boolean = false;
  public misAlmacenes: any[] = [];
  public descuento: any;
  @Input() public set aDescuento(data: any) {
    this.descuento = data;
    console.log('data');
    console.log(data);

    // Aqui se construye el formulario
    this.formularioDescuento = this.formBuilder.group({
      id_almacen: [data.id_almacen, [Validators.required]],
      nombre: [data.nombre, [Validators.required]],
      tipo_descuento: [data.tipo_descuento, [Validators.required]],
      valor: [Number(data.valor), [Validators.required]],
      fecha_inicio: [new Date(data.fecha_inicio), [Validators.required]],
      fecha_vencimiento: [data.fecha_vencimiento ? new Date(data.fecha_vencimiento) : null],
      codigo_promocional: [data.codigo_promocional ?? ''],
      id_desc_tipo_aplicacion: [data.id_desc_tipo_aplicacion, [Validators.required]],
      activo: [data.activo || false, [Validators.required]],
      aplica_limite_descuento: [!!data.aplica_limite_descuento, [Validators.required]],
      importe_minimo_venta: [Number(data.importe_minimo_venta)],
      importe_maximo_venta: [Number(data.importe_maximo_venta)],
      tiene_limite: [!!data.tiene_limite, []],
      limite_uso: [Number(data.limite_uso) || 0],
    });



  }

  constructor(
    private dialogRef: NbDialogRef<FormEditarModalComponent>,
    private almacenUsuariosService: AlmacenUsuariosService,
    private toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private discountsCoreService: DiscountsCoreService,

  ) {


  }

  ngOnInit() {
    this.getMasters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getMasters() {

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
      )
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
    console.log('Valor en formulario:', this.formularioDescuento.get('id_almacen')?.value);


    const value = {
      ...rawValue,
      fecha_inicio: this.datePipe.transform(rawValue.fecha_inicio, 'yyyy-MM-dd HH:mm:ss'),
      fecha_vencimiento: this.datePipe.transform(rawValue.fecha_vencimiento, 'yyyy-MM-dd HH:mm:ss'),
      activo: rawValue.activo ? 1 : 0,
      aplica_limite_descuento: rawValue.aplica_limite_descuento ? 1 : 0,
      tiene_limite: rawValue.tiene_limite ? 1 : 0,
      valor: Number(rawValue.valor),
      importe_minimo_venta: Number(rawValue.importe_minimo_venta),
      importe_maximo_venta: Number(rawValue.importe_maximo_venta),
      limite_uso: Number(rawValue.limite_uso),
      id_almacen: Number(rawValue.id_almacen),

    };
    console.log('Payload final:', value);


    const id = this.descuento?.id_venta_descuento; // Asegúrate de que este campo exista

    this.loadingSpinnerSave = true;
    this.discountsCoreService.editarDescuento(id, value).subscribe({
      next: (respuesta) => {
        this.loadingSpinnerSave = false;
        this.toastrService.success('Descuento editado exitosamente', 'Éxito');
        this.dialogRef.close({ cancel: false, data: respuesta });

      },
      error: (error) => {
        this.toastrService.danger('No se pudo editar el descuento', 'Error');
        this.loadingSpinnerSave = false;
      }
    });


    console.log(value);
    console.log('id_almacen enviado:', value.id_almacen);
  }
}
